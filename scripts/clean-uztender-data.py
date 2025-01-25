import pandas as pd

# Load the JSON file into a pandas DataFrame
df = pd.read_json('data.json', encoding='utf-8')

# Show the first few rows of the DataFrame
print(df.info())

duplicates = df[df.duplicated()]
print(len(duplicates))

df_cleaned = df.drop_duplicates()

print(df_cleaned.info())

df_cleaned.to_json('cleaned_data.json', orient='records', lines=False, force_ascii=False)