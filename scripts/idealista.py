#!/usr/bin/env python3
from __future__ import annotations

import csv
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Optional

import requests
from lxml import html


URL = "https://www.idealista.it/sala-stampa/report-prezzo-immobile/affitto/emilia-romagna/bologna-provincia/bologna/centro-storico/storico/"
OUT = Path("idealista_centro_storico_affitto_storico.csv")

# Italian month names -> month number
IT_MONTH = {
    "gennaio": 1,
    "febbraio": 2,
    "marzo": 3,
    "aprile": 4,
    "maggio": 5,
    "giugno": 6,
    "luglio": 7,
    "agosto": 8,
    "settembre": 9,
    "ottobre": 10,
    "novembre": 11,
    "dicembre": 12,
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/121.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,"
        "application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
}


@dataclass(frozen=True)
class Row:
    month_label: str  # e.g. "Dicembre 2025"
    month_date: date  # e.g. 2025-12-01
    price_eur_m2: Optional[float]
    mom_pct: Optional[float]
    qoq_pct: Optional[float]
    yoy_pct: Optional[float]


def parse_it_month_label(label: str) -> date:
    # "Dicembre 2025" -> date(2025, 12, 1)
    m = re.match(r"^\s*([A-Za-zÀ-ÿ]+)\s+(\d{4})\s*$", label)
    if not m:
        raise ValueError(f"Unexpected month label: {label!r}")
    month_name = m.group(1).strip().lower()
    year = int(m.group(2))
    month = IT_MONTH[month_name]
    return date(year, month, 1)


def parse_eur_m2(cell: str) -> Optional[float]:
    # "19,3 €/m2" -> 19.3
    s = cell.strip()
    if s.upper() == "N/A":
        return None
    s = s.replace("€/m2", "").replace("€", "").strip()
    s = s.replace(".", "").replace(",", ".")  # just in case thousands separators appear
    return float(s)


def parse_pct(cell: str) -> Optional[float]:
    # "+ 1,8 %" -> 1.8 ; "- 3,4 %" -> -3.4 ; "N/A" -> None
    s = cell.strip().replace(" ", "")
    if s.upper() == "N/A":
        return None
    s = s.replace("%", "")
    s = s.replace(",", ".")
    return float(s)


def fetch_html(url: str) -> html.HtmlElement:
    r = requests.get(URL, headers=HEADERS, timeout=30)
    r.raise_for_status()
    return html.fromstring(r.text)


def extract_rows(doc: html.HtmlElement) -> list[Row]:
    # Find the first table whose header contains "Mese"
    tables = doc.xpath("//table[.//th[contains(normalize-space(.), 'Mese')]]")
    if not tables:
        # Sometimes sites swap <th> for <td> in header rows; be defensive.
        tables = doc.xpath(
            "//table[.//*[self::th or self::td][contains(normalize-space(.), 'Mese')]]"
        )
    if not tables:
        raise RuntimeError("Could not find the 'storico' table (header 'Mese').")

    table = tables[0]

    rows: list[Row] = []
    for tr in table.xpath(".//tr[td]"):
        tds = [td.text_content().strip() for td in tr.xpath("./td")]
        if len(tds) < 5:
            continue  # skip malformed rows

        month_label = tds[0]
        month_date = parse_it_month_label(month_label)
        price_eur_m2 = parse_eur_m2(tds[1])
        mom_pct = parse_pct(tds[2])
        qoq_pct = parse_pct(tds[3])
        yoy_pct = parse_pct(tds[4])

        rows.append(
            Row(
                month_label=month_label,
                month_date=month_date,
                price_eur_m2=price_eur_m2,
                mom_pct=mom_pct,
                qoq_pct=qoq_pct,
                yoy_pct=yoy_pct,
            )
        )
    return rows


def write_csv(rows: list[Row], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(
            [
                "month_label",
                "month_date",
                "price_eur_m2",
                "mom_pct",
                "qoq_pct",
                "yoy_pct",
            ]
        )
        for r in rows:
            w.writerow(
                [
                    r.month_label,
                    r.month_date.isoformat(),
                    "" if r.price_eur_m2 is None else r.price_eur_m2,
                    "" if r.mom_pct is None else r.mom_pct,
                    "" if r.qoq_pct is None else r.qoq_pct,
                    "" if r.yoy_pct is None else r.yoy_pct,
                ]
            )


def main() -> None:
    doc = fetch_html(URL)
    rows = extract_rows(doc)
    if not rows:
        raise RuntimeError("No data rows extracted (page structure may have changed).")
    write_csv(rows, OUT)
    print(f"Wrote {len(rows)} rows -> {OUT.resolve()}")


if __name__ == "__main__":
    main()
