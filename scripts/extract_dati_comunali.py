#!/usr/bin/env python3

"""
Convert the Excel file containing municipal tourist accommodation capacity data
from Istat into per-year CSV files.
"""

import pandas as pd

HEADERS = [
    "regioni",
    "cod. reg.",
    "province",
    "cod. prov.",
    "comuni",
    "codice comune",
    "cod istat",
    "5 stelle numero",
    "5 stelle letti",
    "5 stelle camere",
    "5 stelle bagni",
    "4 stelle numero",
    "4 stelle letti",
    "4 stelle camere",
    "4 stelle bagni",
    "3 stelle numero",
    "3 stelle letti",
    "3 stelle camere",
    "3 stelle bagni",
    "2 stelle numero",
    "2 stelle letti",
    "2 stelle camere",
    "2 stelle bagni",
    "1 stelle numero",
    "1 stelle letti",
    "1 stelle camere",
    "1 stelle bagni",
    "residenze turistico alberghiere numero",
    "residenze turistico alberghiere letti",
    "residenze turistico alberghiere camere",
    "residenze turistico alberghiere bagni",
    "totale alberghi numero",
    "totale alberghi letti",
    "totale alberghi camere",
    "totale alberghi bagni",
    "campeggi e villaggi turistici numero",
    "campeggi e villaggi turistici letti",
    "alloggi in affitto numero",
    "alloggi in affitto letti",
    "agriturismi numero",
    "agriturismi letti",
    "ostelli per la gioventù numero",
    "ostelli per la gioventù letti",
    "case per ferie numero",
    "case per ferie letti",
    "rifugi alpini numero",
    "rifugi alpini letti",
    "altri esercizi ricettivi numero",
    "altri esercizi ricettivi letti",
    "bed & breakfast numero",
    "bed & breakfast letti",
    "totale esercizi extra-alberghieri numero",
    "totale esercizi extra-alberghieri letti",
    "totale esercizi ricettivi numero",
    "totale esercizi ricettivi letti",
]

XLS = pd.ExcelFile("capacità_comunale_2013-2024.xlsx")
STRING_COLS = list(range(7))

for year in range(2014, 2025):
    sheet = str(year)
    if sheet in XLS.sheet_names:
        df = pd.read_excel(
            XLS,
            sheet_name=sheet,
            skiprows=5,
            header=None,
            dtype={i: "string" for i in STRING_COLS},
            na_values=["-"],
            thousands=".",
        )

        df.columns = HEADERS[: len(df.columns)]

        for col in df.columns[7:]:
            df[col] = pd.to_numeric(df[col], errors="coerce").astype("Int64")

        df.to_csv(f"{sheet}.csv", index=False)
