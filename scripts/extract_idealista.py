#!/usr/bin/env python3

"""
Extract historical rental price data from an Idealista HTML page and export it
to CSV.

The script parses a locally saved HTML file using XPath, locates the table
containing the historical series identified by the header label "Mese", and
extracts its rows into a structured CSV file.

For each row, the script captures:
- normalized numeric values from the `data-sortable` attributes
- the original human-readable labels as shown in the table

The output CSV is written next to the input file, using the same filename with
the `.csv` extension.

Usage:
    python extract_idealista.py centro-storico-full.html

Input:
    centro-storico-full.html   (HTML file saved from the Idealista website)

Output:
    centro-storico-full.csv    (CSV file derived from the input filename)

Notes:
- The script performs no network requests.
- It assumes the HTML structure used by Idealista's historical price tables.
- Numeric values are already normalized in the source HTML.
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Optional

from lxml import html


def to_float(s: Optional[str]) -> Optional[float]:
    if not s:
        return None
    s = s.strip()
    if s in {"", "-"}:
        return None
    try:
        return float(s)
    except ValueError:
        return None


def extract_table(in_path: Path) -> list[dict]:
    doc = html.fromstring(in_path.read_text(encoding="utf-8"))

    tables = doc.xpath("//table[.//thead//th//span[normalize-space()='Mese']]")
    if not tables:
        raise RuntimeError("Could not find table with header 'Mese'")

    table = tables[0]
    rows: list[dict] = []

    for tr in table.xpath(".//tbody/tr"):
        tds = tr.xpath("./td")
        if len(tds) < 5:
            continue

        rows.append(
            {
                "mese_label": tds[0].text_content().strip(),
                "mese_iso": tds[0].get("data-sortable"),
                "prezzo_m2": to_float(tds[1].get("data-sortable")),
                "var_mensile_pct": to_float(tds[2].get("data-sortable")),
                "var_trimestrale_pct": to_float(tds[3].get("data-sortable")),
                "var_annuale_pct": to_float(tds[4].get("data-sortable")),
                "prezzo_label": tds[1].text_content().strip(),
                "var_mensile_label": tds[2].text_content().strip(),
                "var_trimestrale_label": tds[3].text_content().strip(),
                "var_annuale_label": tds[4].text_content().strip(),
            }
        )

    if not rows:
        raise RuntimeError("Table found but no rows extracted")

    return rows


def write_csv(rows: list[dict], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Extract Idealista storico table from saved HTML into CSV"
    )
    p.add_argument("input_html", type=Path, help="Path to saved HTML file")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    in_path: Path = args.input_html
    out_path: Path = in_path.with_suffix(".csv")

    rows = extract_table(in_path)
    write_csv(rows, out_path)

    print(f"Wrote {len(rows)} rows to {out_path.resolve()}")


if __name__ == "__main__":
    main()
