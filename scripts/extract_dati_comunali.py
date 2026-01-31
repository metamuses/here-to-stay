#!/usr/bin/env python3

"""
Convert the Excel file containing tourist arrivals and overnight stays data
from Istat into per-year CSV files.
"""

import pandas as pd
import numpy as np

HEADERS = [
    "cod. reg.",
    "regione",
    "cod. prov.",
    "provincia",
    "comune",
    "cod. istat",
    "flag",
    "arrivi totale esercizi residenti",
    "arrivi totale esercizi non residenti",
    "arrivi totale esercizi totale",
    "arrivi esercizi alberghieri residenti",
    "arrivi esercizi alberghieri non residenti",
    "arrivi esercizi alberghieri totale",
    "arrivi esercizi extra-alberghieri residenti",
    "arrivi esercizi extra-alberghieri non residenti",
    "arrivi esercizi extra-alberghieri totale",
    "presenze totale esercizi residenti",
    "presenze totale esercizi non residenti",
    "presenze totale esercizi totale",
    "presenze esercizi alberghieri residenti",
    "presenze esercizi alberghieri non residenti",
    "presenze esercizi alberghieri totale",
    "presenze esercizi extra-alberghieri residenti",
    "presenze esercizi extra-alberghieri non residenti",
    "presenze esercizi extra-alberghieri totale",
]

XLS = pd.ExcelFile("dati_comunali_2014-2024.xlsx")
STRING_COLS = list(range(7))

# process sheets for each year from 2014 to 2024
for year in range(2014, 2025):
    sheet = str(year)
    if sheet in XLS.sheet_names:
        df = pd.read_excel(
            XLS,
            sheet_name=sheet,
            skiprows=6,
            header=None,
            dtype={i: "string" for i in STRING_COLS},
            na_values=["-", "(*)"],
            thousands=".",
        )

        # drop the empty separator column
        df.drop(df.columns[16], axis=1, inplace=True)

        # assign proper headers to the dataframe
        df.columns = HEADERS[: len(df.columns)]

        # convert numeric columns to integer type, rounding floats if necessary
        for col in df.columns[7:]:
            s = pd.to_numeric(df[col], errors="coerce")
            s = s.where(s.isna(), np.rint(s))

            df[col] = s.astype("Int64")

        # export to CSV
        df.to_csv(f"istat-arrivals-{sheet}.csv", index=False)
