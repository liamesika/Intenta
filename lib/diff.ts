export type DiffOp = "same" | "add" | "del";

export interface DiffToken {
  type: DiffOp;
  text: string;
}

/**
 * Word-level diff using LCS. Splits on whitespace boundaries while preserving
 * the whitespace tokens, so the rendered diff keeps the original spacing.
 */
export function diffWords(a: string, b: string): DiffToken[] {
  if (a === b) return [{ type: "same", text: a }];

  const aw = a.split(/(\s+)/).filter((s) => s.length > 0);
  const bw = b.split(/(\s+)/).filter((s) => s.length > 0);
  const m = aw.length;
  const n = bw.length;

  // LCS table (lengths only)
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] =
        aw[i] === bw[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffToken[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (aw[i] === bw[j]) {
      pushSame(out, aw[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      pushDel(out, aw[i]);
      i++;
    } else {
      pushAdd(out, bw[j]);
      j++;
    }
  }
  while (i < m) pushDel(out, aw[i++]);
  while (j < n) pushAdd(out, bw[j++]);

  return out;
}

function pushSame(arr: DiffToken[], text: string) {
  const last = arr[arr.length - 1];
  if (last && last.type === "same") last.text += text;
  else arr.push({ type: "same", text });
}
function pushAdd(arr: DiffToken[], text: string) {
  const last = arr[arr.length - 1];
  if (last && last.type === "add") last.text += text;
  else arr.push({ type: "add", text });
}
function pushDel(arr: DiffToken[], text: string) {
  const last = arr[arr.length - 1];
  if (last && last.type === "del") last.text += text;
  else arr.push({ type: "del", text });
}
