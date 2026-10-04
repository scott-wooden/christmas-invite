import test from "node:test";
import assert from "node:assert/strict";
import { handleRsvp, parseRsvp, type Rsvp } from "../src/lib/rsvp";
import { saveRsvp } from "../src/lib/supabase";

const valid = {
  id: "712c432d-6832-4b1a-8ed9-7a37f10886f8",
  name: "  Test Guest  ",
  attendance: "yes",
  plus_one: true,
  needs_room: false,
  website: "",
};
const request = (body: unknown, headers = {}) =>
  new Request("http://localhost:3000/api/rsvp", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

test("all attendance choices save trimmed names and No clears extras", () => {
  for (const attendance of ["yes", "no", "maybe"]) {
    const row = parseRsvp({ ...valid, attendance, needs_room: true });
    assert.equal(row.name, "Test Guest");
    assert.equal(row.plus_one, attendance !== "no");
    assert.equal(row.needs_room, attendance !== "no");
    assert.equal("website" in row, false);
  }
});

test("reject invalid input rather than coercing it", () => {
  for (const patch of [
    { name: " " },
    { name: "a".repeat(101) },
    { name: "A\nB" },
    { attendance: "unknown" },
    { plus_one: "false" },
    { needs_room: null },
    { id: "not-an-id" },
    { website: "spam" },
  ])
    assert.throws(() => parseRsvp({ ...valid, ...patch }));
  for (const value of [null, [], "bad"]) assert.throws(() => parseRsvp(value));
});

test("HTTP success occurs only after persistence", async () => {
  let stored: Rsvp | undefined;
  const res = await handleRsvp(request(valid), async (row) => {
    stored = row;
  });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(stored?.name, "Test Guest");
  const failed = await handleRsvp(request(valid), async () => {
    throw new Error("private database info");
  });
  assert.equal(failed.status, 503);
  assert.doesNotMatch(await failed.text(), /private database info/);
});

test("HTTP rejects invalid JSON, oversized bodies, cross-origin and wrong content-type", async () => {
  const neverSave = async () => {
    assert.fail("must not write");
  };
  assert.equal(
    (
      await handleRsvp(
        request(valid, { origin: "https://elsewhere.example" }),
        neverSave,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleRsvp(
        request(valid, { "content-type": "text/plain" }),
        neverSave,
      )
    ).status,
    415,
  );
  assert.equal(
    (await handleRsvp(request({ ...valid, name: "a".repeat(5000) }), neverSave))
      .status,
    413,
  );
  assert.equal(
    (
      await handleRsvp(
        new Request("http://localhost:3000/api/rsvp", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        }),
        neverSave,
      )
    ).status,
    400,
  );
  assert.equal(
    (await handleRsvp(request({ ...valid, name: "" }), neverSave)).status,
    400,
  );
});

test("storage uses a private key and verifies unchanged retries without overwriting", async (t) => {
  const oldUrl = process.env.SUPABASE_URL;
  const oldKey = process.env.SUPABASE_SECRET_KEY;
  process.env.SUPABASE_URL = "https://test.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test";
  t.after(() => {
    if (oldUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = oldKey;
  });
  const rows = new Map<string, Rsvp>();
  const mock = t.mock.method(
    globalThis,
    "fetch",
    async (url: URL, init: RequestInit) => {
      assert.equal(new Headers(init.headers).get("apikey"), "sb_secret_test");
      if (init.method === "POST") {
        const row: Rsvp = JSON.parse(String(init.body));
        if (rows.has(row.id))
          return Response.json({ code: "23505" }, { status: 409 });
        rows.set(row.id, row);
        return new Response(null, { status: 201 });
      }
      assert.equal(url.searchParams.get("id"), `eq.${valid.id}`);
      return Response.json([rows.get(valid.id)]);
    },
  );
  const row = parseRsvp(valid);
  await saveRsvp(row);
  await saveRsvp(row);
  assert.equal(rows.size, 1);
  await assert.rejects(
    saveRsvp({ ...row, name: "Changed" }),
    /already been used/,
  );
  assert.equal(rows.get(row.id)?.name, "Test Guest");
  mock.mock.mockImplementation(async () => new Response(null, { status: 500 }));
  await assert.rejects(saveRsvp(row), /storage failed/);
});

test("missing Supabase credentials never produce false success", async (t) => {
  const old = process.env.SUPABASE_SECRET_KEY;
  delete process.env.SUPABASE_SECRET_KEY;
  t.after(() => {
    if (old !== undefined) process.env.SUPABASE_SECRET_KEY = old;
  });
  const response = await handleRsvp(request(valid), saveRsvp);
  assert.equal(response.status, 503);
  assert.match(await response.text(), /aren’t open/);
});
