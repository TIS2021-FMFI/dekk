# https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.corr.html
# to install pandas run in your terminal: pip install pandas
import pandas as pd

#simple example how to calculate correlation
# both columns have to be the same length
# here the correlation should be 1
df = pd.DataFrame({'A': range(4), 'B': [2*i for i in range(4)]})
print(df['A'].corr(df['B']))

# negative correlation -1
df = pd.DataFrame({'A': range(4), 'B': [-i for i in range(4)]})
print(df['A'].corr(df['B']))

# random correlation
df = pd.DataFrame({'A': range(4), 'B': [-1, 2, -3, 4]})
print(df['A'].corr(df['B']))
