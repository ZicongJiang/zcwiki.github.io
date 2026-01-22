# FIBER-OPTIC COMMUNICATION SYSTEMS
## Chapter 1
论文的创新点主要是首次将Fourier neural operator (FNO) 引入光纤建模任务。FNO首先对输入使用$\mathcal{P}\in\mathbb{R}^{h\times1}$（lifting operator）, 这是一种将输入的发送信号块$x(t)\in\mathbb{R}^{d_t\times1}$转到隐表征$z_t\in\mathbb{R}^{d_t\times h}$的线性变换。之后隐表征将通过一系列Fourier layers, 最终在$L$层得到的输出的隐表征$z^{(L)}_t$将会被通过一个降维操作$\mathcal{Q}\in\mathbb{R}^{d_t\times1}$（projection operator）来得到最终预测的接收信号。