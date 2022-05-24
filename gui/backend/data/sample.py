import pandas as pd 

data = pd.read_csv('vispub_cleaned.csv')

sample = data.sample(20)

sample.to_csv('vispub_cleaned_sample4.csv', index=False)
