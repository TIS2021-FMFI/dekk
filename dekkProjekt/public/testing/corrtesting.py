import numpy as np
import scipy.stats


a = np.array([0, 0, 0, 1, 1, 1, 1])
b = np.arange(7)
print(scipy.stats.pearsonr(a, b))
# (0.8660254037844386, 0.011724811003954649)