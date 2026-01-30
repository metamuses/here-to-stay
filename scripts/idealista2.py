from lxml import html
import csv

# Read the local HTML file
with open("centro-storico.html", "r", encoding="utf-8") as f:
    content = f.read()

tree = html.fromstring(content)

# Extract headers
header_cells = tree.xpath(
    '//table[contains(@class, "price-indicator")]//thead//th/span/text()'
)
headers_clean = [h.strip() for h in header_cells]

# Extract data rows
rows = tree.xpath('//table[contains(@class, "price-indicator")]//tbody/tr')

data = []
for row in rows:
    cells = row.xpath(".//td")
    row_data = []
    for cell in cells:
        # Use data-sortable for clean numeric values, fall back to text
        sortable = cell.get("data-sortable")
        if sortable and sortable != "-":
            row_data.append(sortable)
        else:
            text = "".join(cell.xpath(".//text()")).strip()
            row_data.append(text)
    if row_data:
        data.append(row_data)

# Write to CSV
output_file = "price_data.csv"
with open(output_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers_clean)
    writer.writerows(data)

print(f"Extracted {len(data)} rows to {output_file}")

for row in data[:5]:
    print(row)
