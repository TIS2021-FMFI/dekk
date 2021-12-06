import numpy as np
import scipy.stats
import random
import matplotlib.pyplot as plt

# data
# x = np.random.normal(loc = 20, scale = 5, size = 20)
x = np.arange(20)
# a = [0]*10 + [1]*10
# random.shuffle(a)
# y = np.random.normal(loc = 20, scale = 5, size = 20)
a = [1, 0, 3, 2, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14, 17, 16, 18, 19 ]
y = np.array(a)

# Shapiro-Wilk test
stat_sx, p_sx = scipy.stats.shapiro(x)
stat_sy, p_sy = scipy.stats.shapiro(y)

# normality test
stat_nx, p_nx = scipy.stats.normaltest(x)
stat_ny, p_ny = scipy.stats.normaltest(y)

# choose type of correlation
if p_sx > 0.05 and p_sy > 0.05 and p_nx > 1e-3 and p_ny >1e-3:
    print(scipy.stats.pearsonr(x, y))
else:
    print(scipy.stats.spearmanr(x, y))

# find function, which approximates best given data
slope, intercept, r, p, stderr = scipy.stats.linregress(x, y)
line = f'Regression line: y={intercept:.2f}+{slope:.2f}x, r={r:.2f}'
print(f'Regression line: y={intercept:.2f}+{slope:.2f}x, r={r:.2f}')

# plot 
fig, ax = plt.subplots()
ax.plot(x, y, linewidth=0, marker='s', label='Data points')
ax.plot(x, intercept + slope * x, label=line)
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.legend(facecolor='white')
plt.show()
