# Datasets

This directory contains the datasets used and produced in the analyses.  
They are divided into two categories: original datasets collected from
first-party sources, and derivative datasets created via KNIME workflows.

## Original

These are the original datasets collected for the analyses from first-party sources.

### D1_ACCOMMODATIONS_BOLOGNA

###### Description
List of establishments belonging to the category of accommodation activities in
the municipality of Bologna

###### Sources
- [OpenData Comune di Bologna](https://opendata.comune.bologna.it/explore/dataset/elenco-esercizi-attivita-ricettive/)

###### Raw files
- [`elenco-esercizi-attivita-ricettive.csv`](original/elenco-esercizi-attivita-ricettive.csv)

---

### D2_ACCOMMODATIONS_CAPACITY

###### Description
Capacity of collective tourist accommodation by type of accommodation and municipality

###### Sources
- [ISTAT](https://esploradati.istat.it/databrowser/#/it/dw/categories/IT1,Z0700SER,1.0/SER_TOURISM/SER_TOURISM_RELATED_FILES)

###### Raw files
- [`capacità_comunale_2013-2024.xlsx`](original/raw/istat/capacità_comunale_2013-2024.xlsx)

###### Segmented files
- [`istat-facilities-2014.csv`](original/istat/facilities/istat-facilities-2014.csv)
- [`istat-facilities-2015.csv`](original/istat/facilities/istat-facilities-2015.csv)
- [`istat-facilities-2016.csv`](original/istat/facilities/istat-facilities-2016.csv)
- [`istat-facilities-2017.csv`](original/istat/facilities/istat-facilities-2017.csv)
- [`istat-facilities-2018.csv`](original/istat/facilities/istat-facilities-2018.csv)
- [`istat-facilities-2019.csv`](original/istat/facilities/istat-facilities-2019.csv)
- [`istat-facilities-2020.csv`](original/istat/facilities/istat-facilities-2020.csv)
- [`istat-facilities-2021.csv`](original/istat/facilities/istat-facilities-2021.csv)
- [`istat-facilities-2022.csv`](original/istat/facilities/istat-facilities-2022.csv)
- [`istat-facilities-2023.csv`](original/istat/facilities/istat-facilities-2023.csv)
- [`istat-facilities-2024.csv`](original/istat/facilities/istat-facilities-2024.csv)

---

### D3_TOURIST_FLOW

###### Description
Occupancy in collective accommodation establishments at municipality level by type of accomodation and residence of guests

###### Sources
- [ISTAT](https://esploradati.istat.it/databrowser/#/it/dw/categories/IT1,Z0700SER,1.0/SER_TOURISM/SER_TOURISM_RELATED_FILES)

###### Raw files
- [`dati_comunali_2014-2024.xlsx`](original/raw/istat/dati_comunali_2014-2024.xlsx)

###### Segmented files
- [`istat-arrivals-2014.csv`](original/istat/arrivals/istat-arrivals-2014.csv)
- [`istat-arrivals-2015.csv`](original/istat/arrivals/istat-arrivals-2015.csv)
- [`istat-arrivals-2016.csv`](original/istat/arrivals/istat-arrivals-2016.csv)
- [`istat-arrivals-2017.csv`](original/istat/arrivals/istat-arrivals-2017.csv)
- [`istat-arrivals-2018.csv`](original/istat/arrivals/istat-arrivals-2018.csv)
- [`istat-arrivals-2019.csv`](original/istat/arrivals/istat-arrivals-2019.csv)
- [`istat-arrivals-2020.csv`](original/istat/arrivals/istat-arrivals-2020.csv)
- [`istat-arrivals-2021.csv`](original/istat/arrivals/istat-arrivals-2021.csv)
- [`istat-arrivals-2022.csv`](original/istat/arrivals/istat-arrivals-2022.csv)
- [`istat-arrivals-2023.csv`](original/istat/arrivals/istat-arrivals-2023.csv)
- [`istat-arrivals-2024.csv`](original/istat/arrivals/istat-arrivals-2024.csv)

---

### D4_LEGISLATIONS

###### Description
National and regional legislations on tourist rentals

###### Sources
- [Normattiva](https://www.normattiva.it/) (but created by us)

###### Raw files
- [`legislations.csv`](original/legislations.csv)

---

### D5_RENTAL_PRICES_BOLOGNA

###### Description
Rental prices of residential properties offered for rent through the Idealista platform in Bologna

###### Sources
- [Idealista](https://www.idealista.it/sala-stampa/report-prezzo-immobile/affitto/emilia-romagna/bologna-provincia/bologna/)

###### Raw files
- [`idealista-storico-centro_storico.html`](original/raw/idealista/idealista-storico-centro_storico.html)
- [`idealista-storico-costa_saragozza.html`](original/raw/idealista/idealista-storico-costa_saragozza.html)
- [`idealista-storico-murri.html`](original/raw/idealista/idealista-storico-murri.html)
- [`idealista-storico-navile_bolognina.html`](original/raw/idealista/idealista-storico-navile_bolognina.html)
- [`idealista-storico-saffi.html`](original/raw/idealista/idealista-storico-saffi.html)

###### Segmented files
- [`idealista-storico-centro_storico.csv`](original/idealista/idealista-storico-centro_storico.csv)
- [`idealista-storico-costa_saragozza.csv`](original/idealista/idealista-storico-costa_saragozza.csv)
- [`idealista-storico-murri.csv`](original/idealista/idealista-storico-murri.csv)
- [`idealista-storico-navile_bolognina.csv`](original/idealista/idealista-storico-navile_bolognina.csv)
- [`idealista-storico-saffi.csv`](original/idealista/idealista-storico-saffi.csv)

---

### D6_STUDENT_ENROLLMENT

###### Description
Students enrolled by residence and university of enrollment

###### Sources
- [USTAT MUR](https://dati-ustat.mur.gov.it/dataset/iscritti/resource/b270ef1a-c219-48b1-8399-b1458e225d39)

###### Raw files
- [`14a_iscrittixresidenzasedecorsogruppo.csv`](original/14a_iscrittixresidenzasedecorsogruppo.csv)

---
---

## Mashup

These are derivative datasets created via KNIME workflows from the original datasets.

### MD1_ISTAT_OPENDATA_ACCOMMODATIONS

###### Description
Comparison between ISTAT and municipal Open Data on accommodation establishments in Bologna

###### Raw files
- [`mashup/istat_opendata_accommodations.csv`](mashup/istat_opendata_accommodations.csv)

---

### MD2_TOURISM_CARRYING_CAPACITY

###### Description
Estimate of tourism carrying capacity in Bologna

###### Raw files
- [`mashup/tourism_carrying_capacity.csv`](mashup/tourism_carrying_capacity.csv)

---

### MD3_LEGISLATIVE_IMPACT

###### Description
Impact of legislations on tourist rentals in Bologna

###### Raw files
- [`mashup/legislative_impact.csv`](mashup/legislative_impact.csv)

---

### MD4_PRICE_FACILITIES_GROWTH

###### Description
Comparison between growth rate of rental prices and accommodation establishments in Bologna

###### Raw files
- [`mashup/price_facilities_growth.csv`](mashup/price_facilities_growth.csv)

---

### MD5_REGIONAL_ENROLLMENT_RENT_PRICES

###### Description
Comparison between university enrollments and rental prices at regional level

###### Raw files
- [`mashup/regional_enrollment_rent_prices.csv`](mashup/regional_enrollment_rent_prices.csv)

---

### MD6_REGIONAL_SENSITIVITY_INDEX

###### Description
Regional sensitivity index to student enrollments

###### Raw files
- [`mashup/regional_sensitivity_index.csv`](mashup/regional_sensitivity_index.csv)

---
---

## Metadata

Metadata for all datasets (titles, descriptions, licenses, distributions) is available in [`metadata.ttl`](../metadata/metadata.ttl)
