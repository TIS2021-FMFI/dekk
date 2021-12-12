import numpy as np
import scipy.stats
import sys

#load arguments
input = sys.argv[1].split(";")

x = np.array([float(i) for i in input[0].split(",")])
y = np.array([float(i) for i in input[1].split(",")])    

# Shapiro-Wilk test
stat_sx, p_sx = scipy.stats.shapiro(x)
stat_sy, p_sy = scipy.stats.shapiro(y)

# normality test
stat_nx, p_nx = scipy.stats.normaltest(x)
stat_ny, p_ny = scipy.stats.normaltest(y)

# choose type of correlation
corr = 0
if p_sx > 0.05 and p_sy > 0.05 and p_nx > 1e-3 and p_ny >1e-3:
    corr = scipy.stats.pearsonr(x, y)
else:
    corr = scipy.stats.spearmanr(x, y)

# find function, which approximates best given data
slope, intercept, r, p, stderr = scipy.stats.linregress(x, y)
# return correlation, intercept and slope of approximation line
print(str(corr) + ";" + str(intercept) + ";" + str(slope))
