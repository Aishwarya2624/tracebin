import crypto from "crypto";

export const generateHash = (data) => {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
};

export const signEvent = ({ payload, prevHash = "", actor }) => {
  const base = { payload, prevHash, actor, ts: Date.now() };
  const hash = generateHash(base);
  return { hash, signature: hash.slice(0, 16), prevHash: prevHash || null };
};

export const verifyChain = (events = []) => {
  for (let i = 1; i < events.length; i++) {
    const expected = generateHash({ payload: events[i].payload, prevHash: events[i - 1].hash, actor: events[i].actor, ts: events[i].createdAt?.getTime?.() });
    if (expected !== events[i].hash) return false;
  }
  return true;
};
