# 相干光纤通信系统核心概念 Wiki

  

> **作者笔记**：本文档面向光纤通信与人工智能交叉方向研究者，作为个人知识库使用。所有数学推导力求自洽、严格，参考文献均可核查。若发现错误，请在文档末尾注记。

> **最后更新**：2026-05-14

> **适用系统**：PolMux 相干 WDM 系统，采用软件定义 DSP 收发架构
---

  

## 目录

  

- [1. Q 因子与误码率](#sec-1-q-factor-ber)

- [1.1 物理直觉](#sec-1-1-intuition)

- [1.2 二进制系统的严格定义](#sec-1-2-binary-definition)

- [1.3 高阶 QAM 的推广](#sec-1-3-qam-extension)

- [1.4 Q 与 BER 的对应表](#sec-1-4-q-ber-table)

- [1.5 参考文献](#sec-1-5-references)

- [2. 接收机 DSP 处理链](#sec-2-rx-dsp-chain)

- [2.1 处理链总览](#sec-2-1-overview)

- [2.2 CDC：色散补偿](#sec-2-2-cdc)

- [2.3 MIMO 均衡器：偏振解复用与 PMD 补偿](#sec-2-3-mimo-equalizer)

- [2.4 FOE：频率偏移估计](#sec-2-4-foe)

- [2.5 CPE：载波相位估计](#sec-2-5-cpe)

- [2.6 参考文献](#sec-2-6-references)

- [3. DSP 对 PMD 与相位噪声时变效应的缓解机制](#sec-3-time-varying-effects)

- [3.1 时变信道的统计特征](#sec-3-1-statistics)

- [3.2 自适应均衡跟踪 PMD](#sec-3-2-pmd-tracking)

- [3.3 CPE 跟踪相位噪声](#sec-3-3-phase-tracking)

- [3.4 参考文献](#sec-3-4-references)

- [4. 发送机 DSP：Pulse Shaping、Resampling 与 Precompensation](#sec-4-tx-dsp)

- [4.1 Pulse Shaping：脉冲成形](#sec-4-1-pulse-shaping)

- [4.2 Resampling：重采样](#sec-4-2-resampling)

- [4.3 Precompensation：预补偿](#sec-4-3-precompensation)

- [4.4 参考文献](#sec-4-4-references)

- [5. 非线性效应：SPM、XPM 与平均非线性](#sec-5-nonlinearity)

- [5.1 光 Kerr 效应与 NLSE](#sec-5-1-kerr-nlse)

- [5.2 SPM：自相位调制](#sec-5-2-spm)

- [5.3 XPM：交叉相位调制](#sec-5-3-xpm)

- [5.4 随机噪声与非线性的耦合：Gordon--Mollenauer 效应](#sec-5-4-gordon-mollenauer)

- [5.5 高斯噪声（GN）模型：统计平均非线性](#sec-5-5-gn-model)

- [5.6 参考文献](#sec-5-6-references)

- [6. PCS 调制与互信息](#sec-6-pcs-mi)

- [6.1 均匀 QAM 的成形间隙](#sec-6-1-shaping-gap)

- [6.2 概率星座成形（PCS）](#sec-6-2-pcs)

- [6.3 Maxwell--Boltzmann 分布的推导](#sec-6-3-mb-derivation)

- [6.4 互信息（Mutual Information）](#sec-6-4-mi)

- [6.5 为什么用 MI/GMI 而非 BER 评估 PCS-QAM](#sec-6-5-mi-vs-ber)

- [6.6 可达信息速率（AIR）](#sec-6-6-air)

- [6.7 CCDM 实现](#sec-6-7-ccdm)

- [6.8 参考文献](#sec-6-8-references)

- [7. 伪随机数生成算法（PRNG）](#sec-7-prng)

- [7.1 蒙特卡洛仿真中 PRNG 质量的重要性](#sec-7-1-importance)

- [7.2 梅森旋转算法（MT19937）](#sec-7-2-mt19937)

- [7.3 组合多重递归算法（MRG）](#sec-7-3-mrg)

- [7.4 滞后斐波那契生成器（LFG）](#sec-7-4-lfg)

- [7.5 Counter-Based PRNG：Philox 与 Threefry](#sec-7-5-cbrng)

- [7.6 算法对比与选用建议](#sec-7-6-comparison)

- [7.7 参考文献](#sec-7-7-references)

- [8. EEPN、周跳与 GAN 建模](#sec-8-eepn-cycle-slip-gan)

- [8.1 EEPN：均衡增强相位噪声](#sec-8-1-eepn)

- [8.2 EEPN 的等效噪声功率](#sec-8-2-eepn-power)

- [8.3 用 GAN 建模 EEPN 的随机特性](#sec-8-3-gan)

- [8.4 周跳（Cycle Slip）](#sec-8-4-cycle-slip)

- [8.5 导频辅助 CPE 缓解周跳](#sec-8-5-pilot-cpe)

- [8.6 综合理解](#sec-8-6-summary)

- [8.7 参考文献](#sec-8-7-references)

- [附录 A：符号说明](#appendix-a-symbols)

- [附录 B：推荐学习资源](#appendix-b-resources)

- [附录 C：仍建议人工复核的点](#appendix-c-review)

  

---

  

<a id="sec-1-q-factor-ber"></a>

## 1. Q 因子与误码率

  

<a id="sec-1-1-intuition"></a>

### 1.1 物理直觉

  

**Q 因子**（Q-factor）衡量接收端判决时的**信号分离程度与噪声扩散程度之比**，是一个无量纲的信噪裕量指标。

  

直观地说：把接收到的 “0” 和 “1” 在判决变量轴上的条件概率密度画出来，两类分布的均值相距越远、各自标准差越小，就越不容易判错。

  

```text

概率密度

^

| "0"分布 "1"分布

| __ __

| / \ / \

| / \ / \

| / \ / \

|/ \_______/ \

+---------------------------------> 判决变量 r

μ₀ ← d → μ₁

σ₀ σ₁

  

Q = (μ₁ - μ₀) / (σ₁ + σ₀)

```

  

<a id="sec-1-2-binary-definition"></a>

### 1.2 二进制系统的严格定义

  

对于采用高斯噪声模型的二进制系统，两个符号在判决时刻的条件概率密度为

  

$$

p(r\mid 1)=\frac{1}{\sqrt{2\pi}\,\sigma_1}

\exp\left[-\frac{(r-\mu_1)^2}{2\sigma_1^2}\right],

$$

  

$$

p(r\mid 0)=\frac{1}{\sqrt{2\pi}\,\sigma_0}

\exp\left[-\frac{(r-\mu_0)^2}{2\sigma_0^2}\right].

$$

  

假设 $\mu_1>\mu_0$，Q 因子定义为

  

$$

\boxed{Q\triangleq \frac{\mu_1-\mu_0}{\sigma_1+\sigma_0}}.

$$

  

在等先验概率、忽略高斯 PDF 前因子差异导致的对数修正时，近似最优判决门限为

  

$$

D_{\mathrm{opt}}

=\frac{\mu_1\sigma_0+\mu_0\sigma_1}{\sigma_0+\sigma_1}.

$$

  

更严格地，等先验下的最优门限满足

  

$$

\frac{(D-\mu_0)^2}{2\sigma_0^2}

-\frac{(D-\mu_1)^2}{2\sigma_1^2}

=\ln\frac{\sigma_1}{\sigma_0}.

$$

  

当 $\sigma_0\approx\sigma_1$ 或对数项可忽略时，上式退化为上述常用门限。此时

  

$$

\frac{\mu_1-D_{\mathrm{opt}}}{\sigma_1}

=

\frac{D_{\mathrm{opt}}-\mu_0}{\sigma_0}=Q.

$$

  

BER 为

  

$$

\begin{aligned}

\mathrm{BER}

&=\frac{1}{2}\left[P(r<D\mid 1)+P(r>D\mid 0)\right] \\

&=\frac{1}{2}\left[

P\left(Z<\frac{D-\mu_1}{\sigma_1}\right)

+P\left(Z>\frac{D-\mu_0}{\sigma_0}\right)

\right],

\end{aligned}

$$

  

其中 $Z\sim\mathcal{N}(0,1)$。代入近似最优门限得到

  

$$

\boxed{\mathrm{BER}=\frac{1}{2}\operatorname{erfc}\left(\frac{Q}{\sqrt{2}}\right)}.

$$

  

互补误差函数定义为

  

$$

\operatorname{erfc}(x)=\frac{2}{\sqrt{\pi}}\int_x^{\infty}e^{-t^2}\,dt.

$$

  

高 SNR 近似为

  

$$

\mathrm{BER}\approx \frac{1}{Q\sqrt{2\pi}}\exp\left(-\frac{Q^2}{2}\right),\qquad Q\gg 1.

$$

  

**注意**：Q 因子的 dB 表示常写为

  

$$

Q_{\mathrm{dB}}=20\log_{10}Q.

$$

  

也有文献称其为 “$Q^2$ factor in dB”，但数值仍常写成 $20\log_{10}Q$。因此比较不同论文的 Q 值时必须先检查定义。

  

<a id="sec-1-3-qam-extension"></a>

### 1.3 高阶 QAM 的推广

  

对于方形 $M$-QAM，令 $M=L^2$，每维有 $L=\sqrt{M}$ 个电平。AWGN 信道下，若星座均匀且采用最近邻判决，符号错误率常用近似为

  

$$

P_s \approx 4\left(1-\frac{1}{\sqrt{M}}\right)

Q_{\mathcal{N}}\left(\sqrt{\frac{3\gamma_s}{M-1}}\right),

$$

  

其中 $\gamma_s=E_s/N_0$ 为每符号 SNR，$Q_{\mathcal{N}}(x)$ 是标准正态尾概率函数：

  

$$

Q_{\mathcal{N}}(x)=\frac{1}{2}\operatorname{erfc}\left(\frac{x}{\sqrt{2}}\right).

$$

  

等价地，

  

$$

P_s \approx 4\left(1-\frac{1}{\sqrt{M}}\right)

\frac{1}{2}\operatorname{erfc}\left(

\sqrt{\frac{3\gamma_s}{2(M-1)}}

\right).

$$

  

若采用 Gray 编码且误码主要由最近邻错误造成，

  

$$

P_b\approx \frac{P_s}{\log_2 M}.

$$

  

一个常见的“等效 Q”写法为

  

$$

Q_{M\text{-QAM,eq}}=\sqrt{\frac{3\gamma_s}{M-1}}.

$$

  

例如 16-QAM：

  

$$

Q_{16\text{-QAM,eq}}=\sqrt{\frac{\gamma_s}{5}}.

$$

  

这个 $Q_{M\text{-QAM,eq}}$ 是从最近邻 AWGN 近似中抽出的等效距离参数，不应与二进制 OOK/二电平判决的 Q 因子混为同一物理量。

  

<a id="sec-1-4-q-ber-table"></a>

### 1.4 Q 与 BER 的对应表

  

下表使用

  

$$

\mathrm{BER}=\frac{1}{2}\operatorname{erfc}\left(\frac{Q}{\sqrt{2}}\right)

=Q_{\mathcal{N}}(Q)

$$

  

计算。数值四舍五入到 2--3 位有效数字。

  

| 线性 $Q$ | $Q_{\mathrm{dB}}=20\log_{10}Q$ | BER | 常见说明 |

|---:|---:|---:|:---|

| 2.67 | 8.53 dB | $3.8\times 10^{-3}$ | 约 20% OH SD-FEC 常见预 FEC BER 阈值量级 |

| 3.09 | 9.80 dB | $1.0\times 10^{-3}$ | — |

| 3.50 | 10.89 dB | $2.3\times 10^{-4}$ | — |

| 5.00 | 13.98 dB | $2.9\times 10^{-7}$ | — |

| 6.00 | 15.56 dB | $1.0\times 10^{-9}$ | 传统强 FEC/低 BER 参考量级 |

| 7.03 | 16.94 dB | $1.0\times 10^{-12}$ | — |

  

**关键修正**：`8.53 dB` 是 dB 值，不是线性 Q 值。若线性 $Q=8.53$，则 BER 约为 $7\times 10^{-18}$，与 $3.8\times10^{-3}$ 完全不对应。

  

<a id="sec-1-5-references"></a>

### 1.5 参考文献

  

1. Agrawal, G. P. (2010/2021). *Fiber-Optic Communication Systems*. Wiley. Q factor 与 BER 推导见接收机噪声/BER 章节。

2. Forestieri, E. (2000). “Evaluating the error probability in lightwave systems with chromatic dispersion, arbitrary pulse shape and pre- and postdetection filtering.” *Journal of Lightwave Technology*, 18(11), 1493--1503.

  

---

  

<a id="sec-2-rx-dsp-chain"></a>

## 2. 接收机 DSP 处理链

  

<a id="sec-2-1-overview"></a>

### 2.1 处理链总览

  

现代相干接收机经过 90° optical hybrid 与平衡探测后输出四路模拟信号：XI、XQ、YI、YQ。ADC 采样后进入全数字 DSP 处理链：

  

```text

ADC 输出

(XI, XQ, YI, YQ)

│

▼

┌─────────────┐

│ CDC │ ← 静态频域滤波，补偿已知或估计的 D·L

│ 色散补偿 │

└──────┬──────┘

│

▼

┌─────────────┐

│ 2×2 MIMO │ ← 自适应 FIR，偏振解复用与 PMD/PDL 部分补偿

│ 均衡器 │

└──────┬──────┘

│

▼

┌─────────────┐

│ FOE │ ← 频率偏移估计与补偿

│ 频率恢复 │

└──────┬──────┘

│

▼

┌─────────────┐

│ CPE │ ← 载波相位估计

│ 相位恢复 │

└──────┬──────┘

│

▼

判决 / 软判决输出 → FEC 译码

```

  

实际系统中，FOE 和 MIMO 的相对位置可因算法实现而变化。例如粗频偏估计可放在均衡前，以免大频偏影响 CMA 收敛；细频偏估计也可在均衡后完成。上图表示一种常见的逻辑链，而非唯一实现。

  

<a id="sec-2-2-cdc"></a>

### 2.2 CDC：色散补偿

  

#### 色散的数学描述

  

光纤中群速度色散（Group Velocity Dispersion, GVD）引起的基带频域传递函数可写成

  

$$

H_{\mathrm{fiber,CD}}(f)

=\exp\left(j\frac{\pi\lambda^2DL}{c}f^2\right).

$$

  

其中：

  

- $D$：色散系数，常用单位 ps/(nm·km)；标准 SMF 在 1550 nm 附近典型值约 $17\,\mathrm{ps/(nm\cdot km)}$。

- $L$：光纤长度。

- $\lambda$：载波波长。

- $c$：真空光速。

  

引入

  

$$

\beta_2=-\frac{\lambda^2D}{2\pi c},

$$

  

则同一响应可写为

  

$$

H_{\mathrm{fiber,CD}}(f)

=\exp\left[-j\frac{\beta_2L}{2}(2\pi f)^2\right].

$$

  

#### CDC 的实现

  

理想 CDC 施加逆响应：

  

$$

H_{\mathrm{CDC}}(f)=H_{\mathrm{fiber,CD}}^{-1}(f)

=\exp\left(-j\frac{\pi\lambda^2DL}{c}f^2\right)

=\exp\left[j\frac{\beta_2L}{2}(2\pi f)^2\right].

$$

  

频域块处理通常使用 Overlap-Save 或 Overlap-Add 方法。若采样率为 $f_s$，色散记忆长度的数量级可估为

  

$$

N_{\mathrm{tap}}\sim 2\pi f_s^2\left|\frac{\lambda^2DL}{c}\right|.

$$

  

这里 $D$ 必须换成 SI 单位：

  

$$

17\,\mathrm{ps/(nm\cdot km)}=17\times10^{-6}\,\mathrm{s/m^2}.

$$

  

例：$f_s=64\,\mathrm{GSa/s}$，$D=17\,\mathrm{ps/(nm\cdot km)}$，$L=1000\,\mathrm{km}$，$\lambda=1550\,\mathrm{nm}$：

  

$$

\left|\frac{\lambda^2DL}{c}\right|

\approx 1.36\times10^{-19}\,\mathrm{s^2},

$$

  

$$

N_{\mathrm{tap}}\sim 2\pi(64\times10^9)^2(1.36\times10^{-19})

\approx 3.5\times10^3.

$$

  

实际所需 tap 数还取决于采样率、roll-off、截断准则和允许残余 ISI，因此工程估计可在几千 tap 量级浮动。频域实现复杂度为 $O(N\log N)$，明显优于直接时域长 FIR。

  

CDC 是**静态线性处理**：若 $D\cdot L$ 已知，可直接补偿；若未知，可先通过盲估计或训练序列估计累计色散后再补偿。

  

<a id="sec-2-3-mimo-equalizer"></a>

### 2.3 MIMO 均衡器：偏振解复用与 PMD 补偿

  

#### 物理模型

  

PolMux 系统在两个正交偏振态上传输独立数据。经历双折射光纤后，偏振态会旋转、耦合并产生差分群时延（DGD）。频域模型为

  

$$

\begin{bmatrix}

R_x(f) \\

R_y(f)

\end{bmatrix}

=

\mathbf{H}(f,t)

\begin{bmatrix}

S_x(f) \\

S_y(f)

\end{bmatrix}

+

\begin{bmatrix}

N_x(f) \\

N_y(f)

\end{bmatrix}.

$$

  

一阶 PMD 可用 Jones 矩阵写成

  

$$

\mathbf{H}(f,t)=

\mathbf{U}(t)

\begin{bmatrix}

\exp\left(j\frac{\Delta\tau}{2}2\pi f\right) & 0 \\

0 & \exp\left(-j\frac{\Delta\tau}{2}2\pi f\right)

\end{bmatrix}

\mathbf{V}(t),

$$

  

其中 $\Delta\tau$ 是 DGD，$\mathbf{U}(t)$ 和 $\mathbf{V}(t)$ 为酉矩阵。

  

#### 蝶形 2×2 自适应 FIR 结构

  

令输入向量为

  

$$

\mathbf{r}(n)=

\begin{bmatrix}

\mathbf{r}_x(n) \\

\mathbf{r}_y(n)

\end{bmatrix}\in\mathbb{C}^{2N_t},

$$

  

其中 $\mathbf{r}_x(n)$、$\mathbf{r}_y(n)$ 是长度为 $N_t$ 的抽头输入。两个输出为

  

$$

\hat{s}_x(n)=\mathbf{h}_{xx}^H\mathbf{r}_x(n)+\mathbf{h}_{xy}^H\mathbf{r}_y(n),

$$

  

$$

\hat{s}_y(n)=\mathbf{h}_{yx}^H\mathbf{r}_x(n)+\mathbf{h}_{yy}^H\mathbf{r}_y(n).

$$

  

等价地，

  

$$

\hat{\mathbf{s}}(n)=\mathbf{W}^H(n)\mathbf{r}(n),

\qquad

\mathbf{W}(n)\in\mathbb{C}^{2N_t\times2}.

$$

  

#### CMA：Constant Modulus Algorithm

  

CMA 的代价函数为

  

$$

J_i=\mathbb{E}\left[\left(|\hat{s}_i(n)|^2-R_2\right)^2\right],

$$

  

其中

  

$$

R_2=\frac{\mathbb{E}[|s|^4]}{\mathbb{E}[|s|^2]}.

$$

  

定义

  

$$

e_i(n)=|\hat{s}_i(n)|^2-R_2.

$$

  

若采用约定 $\hat{s}_i(n)=\mathbf{w}_i^H(n)\mathbf{r}(n)$，随机梯度更新可写为

  

$$

\boxed{

\mathbf{w}_i(n+1)

=\mathbf{w}_i(n)-\mu_{\mathrm{CMA}}\,e_i(n)\,\hat{s}_i^*(n)\,\mathbf{r}(n)

}.

$$

  

这个式子中的共轭位置取决于输出定义。若使用 $\hat{s}_i=\mathbf{w}_i^T\mathbf{r}$，则更新式会变成共轭形式。实现时应保持输出定义、误差定义和更新式一致。

  

CMA 对 PSK 严格适配；对 QAM 只是近似，因为 QAM 不是恒模。高阶 QAM 通常使用 CMA 进行初始偏振解复用，然后切换到多模半径算法（MMA/RDE）或 DD-LMS。

  

#### DD-LMS：Decision-Directed LMS

  

CMA 初始收敛后，可切换到硬判决或软判决辅助 LMS。令

  

$$

d_i(n)=\mathcal{D}\left[\hat{s}_i(n)\right],

\qquad

e_i(n)=d_i(n)-\hat{s}_i(n).

$$

  

在 $\hat{s}_i=\mathbf{w}_i^H\mathbf{r}$ 约定下，LMS 更新为

  

$$

\boxed{

\mathbf{w}_i(n+1)=\mathbf{w}_i(n)+\mu_{\mathrm{LMS}}\,\mathbf{r}(n)e_i^*(n)

}.

$$

  

稳态误调（misadjustment）的经典近似为

  

$$

M\approx \frac{\mu_{\mathrm{LMS}}\operatorname{tr}(\mathbf{R})}{2},

\qquad

\mathbf{R}=\mathbb{E}[\mathbf{r}(n)\mathbf{r}^H(n)],

$$

  

在白化输入、每个抽头输入方差为 $\sigma_r^2$ 时，

  

$$

\operatorname{tr}(\mathbf{R})\approx 2N_t\sigma_r^2.

$$

  

步长 $\mu$ 越大，收敛/跟踪越快，但稳态误差更大。

  

<a id="sec-2-4-foe"></a>

### 2.4 FOE：频率偏移估计

  

发射激光器与本振激光器之间的频率差为

  

$$

\Delta f=f_{\mathrm{TX}}-f_{\mathrm{LO}}.

$$

  

忽略其他损伤时，接收基带信号含有线性相位项：

  

$$

r(n)=s(n)\exp\left(j2\pi\Delta f\,nT_s+j\phi_0\right)+v(n).

$$

  

#### M 次方算法（M-PSK）

  

对 M-PSK，符号相位属于 $2\pi/M$ 的整数倍。取 M 次方可消除调制相位：

  

$$

y(n)=r^M(n)\approx C\exp\left(j2\pi M\Delta f\,nT_s\right)+\tilde{v}(n).

$$

  

对 $y(n)$ 做 DFT，峰值索引为 $k^*$ 时，

  

$$

\hat{\Delta f}=\frac{k^*}{MN T_s},

$$

  

其中 $k^*$ 应按 FFT 频率索引解释为正负频率。无混叠估计范围约为

  

$$

|\Delta f|<\frac{f_s}{2M}.

$$

  

#### 高阶 QAM 的频偏估计

  

高阶 QAM 幅度不恒定，M 次方算法性能下降。常见方法包括：

  

1. 利用 QAM 的四重旋转对称性做 4th-power 谱估计。

2. 使用训练序列或导频做数据辅助估计。

3. 在粗估计后用判决导向的相位差估计细化：

  

$$

\hat{\Delta f}

=\frac{1}{2\pi T_s}\angle\left[

\sum_{n=1}^{N-1}z(n)z^*(n-1)

\right],

$$

  

其中 $z(n)$ 是去除调制相位后的辅助序列，例如 $z(n)=r(n)d^*(n)$，$d(n)$ 为训练符号或判决符号。

  

<a id="sec-2-5-cpe"></a>

### 2.5 CPE：载波相位估计

  

#### 相位噪声模型

  

Tx 与 LO 激光器线宽导致相位随机游走。离散时间模型为

  

$$

\phi(n)=\phi(n-1)+\Delta\phi(n),

$$

  

$$

\Delta\phi(n)\sim\mathcal{N}\left(0,\,2\pi\Delta\nu_{\mathrm{total}}T_s\right),

$$

  

其中

  

$$

\Delta\nu_{\mathrm{total}}=\Delta\nu_{\mathrm{TX}}+\Delta\nu_{\mathrm{LO}}.

$$

  

因此

  

$$

\operatorname{Var}[\phi(n+k)-\phi(n)]

=2\pi\Delta\nu_{\mathrm{total}}kT_s.

$$

  

核心归一化参数是 $\Delta\nu T_s$。

  

#### BPS：Blind Phase Search

  

BPS 适用于 QAM/PSK。利用四重旋转对称性，可在 $[-\pi/4,\pi/4)$ 上测试 $B$ 个候选相位：

  

$$

\theta_b=-\frac{\pi}{4}+\frac{b\pi}{2B},

\qquad b=0,1,\ldots,B-1.

$$

  

在以第 $n$ 个符号为中心的窗口 $\mathcal{W}_n=\{n-N_B,\ldots,n+N_B\}$ 内，计算代价

  

$$

C_b(n)=\sum_{k\in\mathcal{W}_n}

\min_{a_m\in\mathcal{A}}

\left|r_k\exp(-j\theta_b)-a_m\right|^2.

$$

  

估计相位为

  

$$

\hat{\phi}(n)=\theta_{b^*(n)},

\qquad

b^*(n)=\arg\min_b C_b(n).

$$

  

随后进行相位解包，以处理 $\pi/2$ 模糊：

  

$$

\hat{\phi}_{\mathrm{unwrap}}(n)

=\hat{\phi}(n)+\frac{\pi}{2}k_n,

\qquad k_n\in\mathbb{Z},

$$

  

其中 $k_n$ 通常选择为使相邻时刻相位变化最小的整数。

  

参数权衡：

  

- $B$ 越大，量化误差越小，但复杂度线性增加。

- $N_B$ 越大，AWGN 测量噪声平均越充分，但对快速相位变化跟踪越慢。

  

#### Viterbi--Viterbi 算法（M-PSK）

  

对 M-PSK，

  

$$

\hat{\phi}(n)=\frac{1}{M}\angle\left[\sum_{k=n-L}^{n+L}r_k^M\right].

$$

  

该方法复杂度低，但只适用于 M-PSK 或近似恒模星座，并存在 $2\pi/M$ 相位模糊。

  

<a id="sec-2-6-references"></a>

### 2.6 参考文献

  

1. Savory, S. J. (2010). “Digital Coherent Optical Receivers: Algorithms and Subsystems.” *IEEE Journal of Selected Topics in Quantum Electronics*, 16(5), 1164--1179.

2. Pfau, T., Hoffmann, S., & Noé, R. (2009). “Hardware-Efficient Coherent Digital Receiver Concept With Feedforward Carrier Recovery for M-QAM Constellations.” *Journal of Lightwave Technology*, 27(8), 989--999.

3. Ip, E., & Kahn, J. M. (2007). “Feedforward carrier recovery for coherent optical communications.” *Journal of Lightwave Technology*, 25(9), 2675--2692.

4. Godard, D. (1980). “Self-Recovering Equalization and Carrier Tracking in Two-Dimensional Data Communication Systems.” *IEEE Transactions on Communications*, 28(11), 1867--1875.

5. Ip, E., Lau, A. P. T., Barros, D. J. F., & Kahn, J. M. (2008). “Coherent detection in optical fiber systems.” *Optics Express*, 16(2), 753--791.

  

---

  

<a id="sec-3-time-varying-effects"></a>

## 3. DSP 对 PMD 与相位噪声时变效应的缓解机制

  

<a id="sec-3-1-statistics"></a>

### 3.1 时变信道的统计特征

  

PMD 与相位噪声都是时变随机过程，但时间尺度不同。

  

| 效应 | 物理来源 | 典型时间尺度 | DSP 对策 |

|:---|:---|:---|:---|

| 偏振旋转/PMD 变化 | 温度、机械振动、应力引起的双折射波动 | 通常远慢于符号率；可从 Hz 到 kHz 甚至更快的扰动 | 自适应 2×2 MIMO 均衡 |

| 激光相位噪声 | 自发辐射导致的相位扩散 | 由线宽决定；$\Delta\nu$ 可为 kHz--MHz | FOE + CPE |

| 符号调制 | 数据调制 | $T_s=1/R_s$，几十 ps 量级 | 匹配滤波、均衡、判决 |

  

核心事实：这些时变损伤的带宽通常远小于符号率，因此 DSP 可以在符号序列上将信道视为块内准静态，并通过递归算法跟踪慢变参数。

  

<a id="sec-3-2-pmd-tracking"></a>

### 3.2 自适应均衡跟踪 PMD

  

LMS 型均衡器的跟踪能力由步长与输入相关矩阵决定。对近似白化输入，等效时间常数可粗略估计为

  

$$

\tau_{\mathrm{LMS}}\sim\frac{1}{\mu\lambda_{\mathrm{eff}}},

$$

  

其中 $\lambda_{\mathrm{eff}}$ 是输入相关矩阵的有效特征值量级。若以符号为时间单位，并用 $\operatorname{tr}(\mathbf{R})$ 粗略表征总输入能量，则跟踪带宽量级为

  

$$

B_{\mathrm{track}}

\sim \frac{\mu\operatorname{tr}(\mathbf{R})}{2\pi}R_s.

$$

  

若 $\operatorname{tr}(\mathbf{R})\approx 2N_t\sigma_r^2$，则

  

$$

B_{\mathrm{track}}

\sim \frac{2\mu N_t\sigma_r^2}{2\pi}R_s.

$$

  

这个估计只给量级；真实跟踪能力还受特征值扩展、判决错误、步长归一化和环路结构影响。

  

步长权衡：

  

$$

\mu\uparrow\Rightarrow

\begin{cases}

\text{收敛与跟踪更快},\\

\text{稳态误调和噪声增强更大}.

\end{cases}

$$

  

实际工程中常采用分阶段或变步长策略：初始捕获阶段大步长，稳态跟踪阶段小步长。

  

<a id="sec-3-3-phase-tracking"></a>

### 3.3 CPE 跟踪相位噪声

  

#### Kalman 滤波框架

  

相位随机游走模型：

  

$$

\phi_n=\phi_{n-1}+w_n,

\qquad

w_n\sim\mathcal{N}(0,Q),

\qquad

Q=2\pi\Delta\nu T_s.

$$

  

高 SNR 下，可将相位观测线性化为

  

$$

z_n=\phi_n+v_n,

\qquad

v_n\sim\mathcal{N}(0,R),

$$

  

其中 $R$ 的量级与相位测量 SNR 相关，常近似与 $1/\mathrm{SNR}$ 成正比。

  

Kalman 递推为

  

$$

\hat{\phi}_{n|n-1}=\hat{\phi}_{n-1|n-1},

$$

  

$$

P_{n|n-1}=P_{n-1|n-1}+Q,

$$

  

$$

K_n=\frac{P_{n|n-1}}{P_{n|n-1}+R},

$$

  

$$

\hat{\phi}_{n|n}=\hat{\phi}_{n|n-1}+K_n(z_n-\hat{\phi}_{n|n-1}),

$$

  

$$

P_{n|n}=(1-K_n)P_{n|n-1}.

$$

  

稳态后，后验协方差 $P=P_{n|n}$ 满足

  

$$

P=\frac{R(P+Q)}{P+Q+R}.

$$

  

解得

  

$$

\boxed{

P=\frac{-Q+\sqrt{Q^2+4QR}}{2}

}.

$$

  

先验协方差为

  

$$

P^-=P+Q=\frac{Q+\sqrt{Q^2+4QR}}{2}.

$$

  

稳态 Kalman 增益为

  

$$

\boxed{

K=\frac{P^-}{P^-+R}

=\frac{Q+\sqrt{Q^2+4QR}}{Q+\sqrt{Q^2+4QR}+2R}

}.

$$

  

当 $Q\to0$ 时，$K\to0$，即相位几乎不变，主要信任预测；当 $Q$ 很大时，$K\to1$，即更信任即时观测。

  

BPS 可理解为一种块式近似 ML/MAP 相位估计。与 Kalman 相比，BPS 实现简单、适用于高阶 QAM，但其窗口长度相当于固定平滑带宽，不能像 Kalman 那样自然融合动态模型与观测噪声模型。

  

<a id="sec-3-4-references"></a>

### 3.4 参考文献

  

1. Charlet, G. et al. (2008). “Efficient Compensation of Ultra-High PMD Combined With PDL for Submarine Transmission.” *Optics Express*, 16(26), 22353--22360.

2. Kuschnerov, M. et al. (2009). “DSP for Coherently Received Optical Transmission Systems.” *Optics Express*, 17(16), 13717--13726.

3. Colavolpe, G., Foggi, T., Forestieri, E., & Prati, G. (2011). “Faster-Than-Nyquist Signaling and Viterbi Decoding for Power-Efficient Coherent Optical Systems.” *ECOC 2011*.

  

---

  

<a id="sec-4-tx-dsp"></a>

## 4. 发送机 DSP：Pulse Shaping、Resampling 与 Precompensation

  

<a id="sec-4-1-pulse-shaping"></a>

### 4.1 Pulse Shaping：脉冲成形

  

#### 奈奎斯特第一准则

  

若符号周期为 $T_s$，为了在采样时刻无码间干扰（ISI），脉冲 $p(t)$ 应满足

  

$$

p(nT_s)=

\begin{cases}

1, & n=0,\\

0, & n\ne0.

\end{cases}

$$

  

等价频域条件为

  

$$

\sum_{k=-\infty}^{\infty}P\left(f-\frac{k}{T_s}\right)=T_s,

\qquad \forall f.

$$

  

满足该条件的理想矩形频谱对应时域 sinc 脉冲，但 sinc 无限延伸，定时误差敏感，工程中通常使用升余弦（RC）或根升余弦（RRC）滤波器。

  

#### 升余弦（RC）滤波器

  

RC 频域响应为

  

$$

H_{\mathrm{RC}}(f)=

\begin{cases}

T_s, & |f|\le \dfrac{1-\alpha}{2T_s},\\[8pt]

\dfrac{T_s}{2}\left[1+\cos\left(\dfrac{\pi T_s}{\alpha}\left(|f|-\dfrac{1-\alpha}{2T_s}\right)\right)\right],

& \dfrac{1-\alpha}{2T_s}<|f|\le\dfrac{1+\alpha}{2T_s},\\[10pt]

0, & |f|>\dfrac{1+\alpha}{2T_s}.

\end{cases}

$$

  

其中 $\alpha\in[0,1]$ 是 roll-off factor。单边带宽为

  

$$

B=\frac{1+\alpha}{2T_s}.

$$

  

#### 根升余弦（RRC）滤波器

  

RRC 满足

  

$$

H_{\mathrm{RRC}}(f)=\sqrt{H_{\mathrm{RC}}(f)}.

$$

  

发射端 RRC 与接收端匹配 RRC 级联得到 RC：

  

$$

H_{\mathrm{RRC}}(f)H_{\mathrm{RRC}}(f)=H_{\mathrm{RC}}(f).

$$

  

RRC 时域冲激响应可写为

  

$$

h_{\mathrm{RRC}}(t)=

\frac{\sin\left[\pi(1-\alpha)t/T_s\right]

+4\alpha(t/T_s)\cos\left[\pi(1+\alpha)t/T_s\right]}

{\pi(t/T_s)\left[1-(4\alpha t/T_s)^2\right]}.

$$

  

该式在 $t=0$ 和 $t=\pm T_s/(4\alpha)$ 处需要用极限值替代，避免数值实现中的 `NaN`。工程实现应显式处理这些特殊点。

  

脉冲成形同时实现：

  

1. 限制频谱占用。

2. 满足采样时刻零 ISI 条件。

3. 配合接收端匹配滤波最大化 AWGN 下的采样 SNR。

  

<a id="sec-4-2-resampling"></a>

### 4.2 Resampling：重采样

  

设符号率为 $R_s$，DSP 内部采样率为 $f_{\mathrm{DSP}}$，DAC 采样率为 $f_{\mathrm{DAC}}$。通常需要实现有理或任意比例的采样率转换：

  

$$

\frac{f_{\mathrm{DAC}}}{f_{\mathrm{DSP}}}\approx\frac{L}{M}.

$$

  

直接结构为：上采样 $\uparrow L$，低通滤波，再下采样 $\downarrow M$。多相分解将 FIR 滤波器写为

  

$$

H(z)=\sum_{\ell=0}^{L-1}z^{-\ell}E_\ell(z^L),

$$

  

其中

  

$$

E_\ell(z)=\sum_{m}h[mL+\ell]z^{-m}.

$$

  

这样可避免在高采样率上执行大量零输入卷积。

  

对任意分数延迟，常用 Farrow 结构：

  

$$

y[n]=\sum_{k=0}^{K-1}c_k(\mu_n)x[n-k],

\qquad \mu_n\in[0,1),

$$

  

其中系数 $c_k(\mu_n)$ 是分数延迟 $\mu_n$ 的多项式函数。

  

<a id="sec-4-3-precompensation"></a>

### 4.3 Precompensation：预补偿

  

#### 4.3.1 发射机频率响应预均衡

  

发射机总响应可写为

  

$$

H_{\mathrm{TX}}(f)=H_{\mathrm{DAC}}(f)H_{\mathrm{driver}}(f)H_{\mathrm{IQM}}(f).

$$

  

DAC 零阶保持（ZOH）响应为

  

$$

H_{\mathrm{ZOH}}(f)=T_{\mathrm{DAC}}\operatorname{sinc}(fT_{\mathrm{DAC}})

\exp(-j\pi fT_{\mathrm{DAC}}),

$$

  

其中采用归一化定义

  

$$

\operatorname{sinc}(x)=\frac{\sin(\pi x)}{\pi x}.

$$

  

在 $f=f_{\mathrm{DAC}}/2$ 处，ZOH 幅度约为 $2/\pi$，即 $-3.92$ dB。

  

若测得 $H_{\mathrm{TX}}(f)$，Tikhonov 正则化预均衡可写为

  

$$

\boxed{

H_{\mathrm{pre}}(f)=\frac{H_{\mathrm{TX}}^*(f)}{|H_{\mathrm{TX}}(f)|^2+\epsilon}

}

$$

  

等价于

  

$$

H_{\mathrm{pre}}(f)=\frac{1}{H_{\mathrm{TX}}(f)}

\frac{|H_{\mathrm{TX}}(f)|^2}{|H_{\mathrm{TX}}(f)|^2+\epsilon}.

$$

  

第二个因子抑制在深衰落频点的过度噪声放大。

  

#### 4.3.2 IQ/XY Skew 预补偿

  

以 X 偏振为例，若 Q 路相对 I 路存在时延 $\Delta\tau_{IQ}$：

  

$$

E_x(t)=x_I(t)+jx_Q(t-\Delta\tau_{IQ}).

$$

  

预补偿可通过分数时延 FIR 实现：

  

$$

x_Q^{\mathrm{pre}}[n]=\sum_k h_{\mathrm{delay}}[k;\delta]x_Q[n-k],

$$

  

其中 $\delta=\Delta\tau_{IQ}/T_s$ 是归一化分数延迟。滤波器可用 Lagrange、Farrow 或 Parks--McClellan 设计。

  

<a id="sec-4-4-references"></a>

### 4.4 参考文献

  

1. Proakis, J. G., & Salehi, M. (2008). *Digital Communications*, 5th ed. McGraw-Hill.

2. Schmogrow, R. et al. (2012). “Error Vector Magnitude as a Performance Measure for Advanced Modulation Formats.” *IEEE Photonics Technology Letters*, 24(1), 61--63.

3. Fludger, C., & Kupfer, T. (2016). “Transmitter Impairment Mitigation and Monitoring for High Baud-Rate, High Order Modulation Systems.” *ECOC 2016*, Tu.2.A.2.

  

---

  

<a id="sec-5-nonlinearity"></a>

## 5. 非线性效应：SPM、XPM 与平均非线性

  

<a id="sec-5-1-kerr-nlse"></a>

### 5.1 光 Kerr 效应与 NLSE

  

光纤折射率随光强变化：

  

$$

n=n_0+n_2I,

$$

  

其中 $I$ 是光强，$n_2$ 是非线性折射率系数。非线性系数定义为

  

$$

\gamma=\frac{\omega_0 n_2}{cA_{\mathrm{eff}}}

=\frac{2\pi n_2}{\lambda A_{\mathrm{eff}}}.

$$

  

标准单模光纤在 1550 nm 附近常见 $\gamma$ 量级为 $1\sim2\,\mathrm{W^{-1}km^{-1}}$。

  

一种常用的标量 NLSE 写法为

  

$$

\frac{\partial A}{\partial z}

=-\frac{\alpha}{2}A

-j\frac{\beta_2}{2}\frac{\partial^2A}{\partial T^2}

+\frac{\beta_3}{6}\frac{\partial^3A}{\partial T^3}

+j\gamma|A|^2A.

$$

  

符号正负与 Fourier 变换约定有关；使用仿真代码时必须与色散算子的符号保持一致。

  

有效长度为

  

$$

L_{\mathrm{eff}}=\frac{1-\exp(-\alpha L)}{\alpha}.

$$

  

<a id="sec-5-2-spm"></a>

### 5.2 SPM：自相位调制

  

忽略色散和损耗时，SPM 解为

  

$$

A(L,T)=A(0,T)\exp\left(j\gamma L|A(0,T)|^2\right).

$$

  

有损耗时，用有效长度近似：

  

$$

A(L,T)\approx A(0,T)\exp\left(j\gamma L_{\mathrm{eff}}|A(0,T)|^2\right).

$$

  

非线性相移为

  

$$

\phi_{\mathrm{NL}}(T)=\gamma L_{\mathrm{eff}}P(T).

$$

  

瞬时频率偏移为

  

$$

\delta\omega(T)=-\frac{d\phi_{\mathrm{NL}}(T)}{dT}

=-\gamma L_{\mathrm{eff}}\frac{dP(T)}{dT}.

$$

  

SPM 产生频谱展宽，并通过色散转换为时域波形失真。

  

<a id="sec-5-3-xpm"></a>

### 5.3 XPM：交叉相位调制

  

WDM 中，第 $i$ 个信道的简化耦合 NLSE 可写为

  

$$

\frac{\partial A_i}{\partial z}

=-\frac{\alpha}{2}A_i

-j\frac{\beta_2}{2}\frac{\partial^2 A_i}{\partial T^2}

-d_i\frac{\partial A_i}{\partial T}

+j\gamma\left(|A_i|^2+2\sum_{k\ne i}|A_k|^2\right)A_i.

$$

  

这里 XPM 系数 2 对应标量或共偏振近似。对随机双偏振长距离链路，Manakov 平均模型会引入不同的有效系数，例如常见的 $8/9$ 因子；应根据建模层级选择。

  

若第 $k$ 个信道功率扰动调制目标信道相位，一阶小信号频域响应可写为

  

$$

H_{\mathrm{XPM}}^{(k)}(f)

=2j\gamma P_k\int_0^L

\exp(-\alpha z)\exp(j2\pi f d_{ik}z)\,dz,

$$

  

即

  

$$

H_{\mathrm{XPM}}^{(k)}(f)

=2j\gamma P_k

\frac{1-\exp[-(\alpha-j2\pi f d_{ik})L]}

{\alpha-j2\pi f d_{ik}}.

$$

  

walk-off 越大，相互作用时间越短，XPM 低频分量以外的贡献越弱。

  

<a id="sec-5-4-gordon-mollenauer"></a>

### 5.4 随机噪声与非线性的耦合：Gordon--Mollenauer 效应

  

Gordon--Mollenauer 效应又称非线性相位噪声（NLPN）：ASE 噪声造成随机功率扰动，经 Kerr 效应转化为随机相位扰动。

  

设第 $l$ 个放大器后的场为

  

$$

A_l=A_s+\Delta A_l^{\mathrm{ASE}}.

$$

  

一阶近似下，ASE 与信号拍频项导致非线性相位扰动。可写成量级关系

  

$$

\phi_{\mathrm{NLPN}}

\propto

\gamma L_{\mathrm{eff}}

\sum_{l=1}^{N_s}

\left(2\operatorname{Re}\left\{A_s^*\Delta A_l^{\mathrm{ASE}}\right\}

+|\Delta A_l^{\mathrm{ASE}}|^2\right).

$$

  

在简化条件下，其方差可近似为

  

$$

\sigma^2_{\mathrm{NLPN}}

\propto

\frac{N_s(N_s+1)}{2}\gamma^2L_{\mathrm{eff}}^2P_sN_{\mathrm{ASE}},

$$

  

其中比例常数取决于噪声带宽、放大器配置、滤波器和归一化约定。

  

<a id="sec-5-5-gn-model"></a>

### 5.5 高斯噪声（GN）模型：统计平均非线性

  

GN 模型将非线性干扰（NLI）近似为加性高斯噪声。双偏振系统中常见形式为

  

$$

G_{\mathrm{NLI}}(f)

=\frac{16}{27}\gamma^2

\iint G_{\mathrm{TX}}(f_1)G_{\mathrm{TX}}(f_2)

G_{\mathrm{TX}}(f_1+f_2-f)

|\chi(f_1,f_2,f)|^2\,df_1\,df_2.

$$

  

其中 $\chi$ 包含衰减、色散、相位匹配和跨段累积。

  

若 NLI 功率可近似为

  

$$

P_{\mathrm{NLI}}=\eta P^3,

$$

  

总 SNR 为

  

$$

\mathrm{SNR}(P)=\frac{P}{N_{\mathrm{ASE}}+\eta P^3}.

$$

  

最大化该式得到最优发射功率

  

$$

\boxed{

P_{\mathrm{opt}}=\left(\frac{N_{\mathrm{ASE}}}{2\eta}\right)^{1/3}

}.

$$

  

<a id="sec-5-6-references"></a>

### 5.6 参考文献

  

1. Agrawal, G. P. (2019). *Nonlinear Fiber Optics*, 6th ed. Academic Press.

2. Gordon, J. P., & Mollenauer, L. F. (1990). “Phase noise in photonic communications systems using linear amplifiers.” *Optics Letters*, 15(23), 1351--1353.

3. Poggiolini, P. (2012). “The GN Model of Non-Linear Propagation in Uncompensated Coherent Optical Systems.” *Journal of Lightwave Technology*, 30(24), 3857--3879.

4. Carena, A. et al. (2014). “EGN model of non-linear fiber propagation.” *Optics Express*, 22(13), 16335--16362.

  

---

  

<a id="sec-6-pcs-mi"></a>

## 6. PCS 调制与互信息

  

<a id="sec-6-1-shaping-gap"></a>

### 6.1 均匀 QAM 的成形间隙

  

复 AWGN 信道为

  

$$

Y=X+N,

\qquad N\sim\mathcal{CN}(0,\sigma^2).

$$

  

若输入满足平均功率约束 $\mathbb{E}[|X|^2]\le P$，连续复高斯输入达到容量

  

$$

C=\log_2\left(1+\frac{P}{\sigma^2}\right).

$$

  

均匀有限 QAM 星座无法完全逼近高斯输入，因此存在成形损失。高维均匀格点与高斯球形 shaping 的经典极限差距为

  

$$

10\log_{10}\left(\frac{\pi e}{6}\right)\approx1.53\,\mathrm{dB}.

$$

  

注意：这个 $1.53$ dB 是高维/高 SNR 极限下的 shaping gap，不等于任意 16-QAM 系统在任意 SNR 下的实际增益。

  

<a id="sec-6-2-pcs"></a>

### 6.2 概率星座成形（PCS）

  

PCS 保持星座几何位置不变，但令星座点概率非均匀，使低能量点出现更频繁，高能量点出现更少，从而在给定信息率下降低平均发射能量或在给定 SNR 下提高可达信息率。

  

对于 QAM，常见做法是对幅度进行成形，而保留符号位近似均匀，这也是 PAS（Probabilistic Amplitude Shaping）的基本思想。

  

<a id="sec-6-3-mb-derivation"></a>

### 6.3 Maxwell--Boltzmann 分布的推导

  

对有限星座 $\mathcal{A}=\{a_k\}$，在固定平均能量约束下最大化输入熵：

  

$$

\max_{P_k} H(X)=-\sum_kP_k\log_2P_k,

$$

  

约束为

  

$$

\sum_kP_k=1,

\qquad

\sum_kP_k|a_k|^2\le P_s.

$$

  

构造拉格朗日函数

  

$$

\mathcal{L}

=-\sum_kP_k\log_2P_k

-\lambda\left(\sum_kP_k-1\right)

-\eta\left(\sum_kP_k|a_k|^2-P_s\right).

$$

  

令偏导为零：

  

$$

\frac{\partial\mathcal{L}}{\partial P_k}

=-\log_2P_k-\frac{1}{\ln2}-\lambda-\eta|a_k|^2=0.

$$

  

解得 Maxwell--Boltzmann 型分布：

  

$$

\boxed{

P_k=\frac{\exp(-\nu|a_k|^2)}{Z(\nu)}

},

\qquad

Z(\nu)=\sum_j\exp(-\nu|a_j|^2).

$$

  

其中 $\nu\ge0$ 控制成形强度。

  

重要限定：MB 分布是有限星座 PCS 中常用且有效的参数化分布，但在有限 SNR 下，严格最大化 MI 的离散输入概率一般需要 Blahut--Arimoto 等数值优化；MB 是接近最优且实现友好的选择，不应表述为所有条件下的严格 MI 最优解。

  

16-QAM 若采用均匀归一化坐标

  

$$

a_{ij}=\frac{(2i-5)+j(2j-5)}{\sqrt{10}},

\qquad i,j\in\{1,2,3,4\},

$$

  

则能量层为

  

$$

|a|^2\in\left\{\frac{2}{10},\frac{10}{10},\frac{18}{10}\right\}.

$$

  

MB 概率正比于

  

$$

\left\{

\exp(-0.2\nu),\;\exp(-1.0\nu),\;\exp(-1.8\nu)

\right\},

$$

  

对应内层 4 点、中间 8 点、外层 4 点。

  

<a id="sec-6-4-mi"></a>

### 6.4 互信息（Mutual Information）

  

互信息定义为

  

$$

I(X;Y)=\sum_{x\in\mathcal{X}}P_X(x)

\int p(y|x)\log_2\frac{p(y|x)}{p_Y(y)}\,dy,

$$

  

其中

  

$$

p_Y(y)=\sum_{x\in\mathcal{X}}P_X(x)p(y|x).

$$

  

对复 AWGN 信道

  

$$

p(y|x)=\frac{1}{\pi\sigma^2}

\exp\left(-\frac{|y-x|^2}{\sigma^2}\right).

$$

  

有限星座、任意先验概率下，可用 Monte Carlo 计算：

  

$$

\boxed{

I(X;Y)=

\mathbb{E}_{X,Y}\left[

\log_2\frac{p(Y|X)}{\sum_{a_j\in\mathcal{A}}P_X(a_j)p(Y|a_j)}

\right]

}.

$$

  

代入 AWGN 条件密度后，常数项相消：

  

$$

I(X;Y)=

\mathbb{E}_{X,N}\left[

\log_2

\frac{\exp(-|N|^2/\sigma^2)}

{\sum_jP_X(a_j)\exp(-|X+N-a_j|^2/\sigma^2)}

\right].

$$

  

若输入均匀 $P_X(a_j)=1/M$，可化为常见形式

  

$$

I(X;Y)=\log_2M-

\frac{1}{M}\sum_i\mathbb{E}_N\left[

\log_2\sum_j

\exp\left(

-\frac{|a_i+N-a_j|^2-|N|^2}{\sigma^2}

\right)

\right].

$$

  

上述含 $\log_2M$ 的形式只适用于均匀输入；PCS 的非均匀输入必须使用带 $P_X(a_j)$ 的一般式。

  

#### GMI：软判决 BICM 更常用的指标

  

实际 Gray 标记 QAM + SD-FEC 常使用 bit-wise decoder，对应的可达率通常是 GMI（Generalized Mutual Information），而不是符号 MI：

  

$$

\mathrm{GMI}=\sum_{k=1}^{m} I(B_k;Y),

\qquad m=\log_2M.

$$

  

对 PCS/PAS，若 bit 先验非均匀，LLR 必须包含先验概率项，否则会产生失配解码损失。

  

<a id="sec-6-5-mi-vs-ber"></a>

### 6.5 为什么用 MI/GMI 而非 BER 评估 PCS-QAM

  

1. **现代 SD-FEC 接收软信息**。FEC 性能与 LLR 分布、GMI/NGMI 等指标更直接相关，而不仅是硬判决 BER。

2. **PCS 改变先验概率**。硬判决 BER 会受符号先验、星座能量层使用频率和判决区域共同影响，不能单独反映软信息质量。

3. **PCS 不是提高输入熵，而是用较低输入熵匹配目标净速率**。均匀 $M$-QAM 的输入熵是 $\log_2M$，PCS 后 $H(X)\le\log_2M$。PCS 的收益来自在目标速率下更接近容量实现的输入分布，而不是“增大 $H(X)$”。

4. **速率自适应需要 AIR/GMI**。成形参数 $\nu$ 改变熵和平均能量，可连续调节净信息率。

  

<a id="sec-6-6-air"></a>

### 6.6 可达信息速率（AIR）

  

对符号级最优解码，AIR 可用 MI 表示；对 bit-wise BICM 解码，常用 GMI 或 NGMI。

  

若某系统在给定 SNR 下估计得到

  

$$

\mathrm{GMI}=3.5\,\mathrm{bits/symbol},

$$

  

且 FEC overhead 为 $20\%$，则码率为

  

$$

R_c=\frac{1}{1+0.20}=\frac{5}{6}\approx0.833.

$$

  

若把 3.5 bits/symbol 理解为可由编码调制承载的 gross coded information measure，则可支持的净信息率量级为

  

$$

R_{\mathrm{net}}\lesssim R_c\times\mathrm{GMI}

=\frac{3.5}{1.2}

\approx2.92\,\mathrm{bits/symbol}.

$$

  

更严谨地，PAS 的净速率通常按幅度熵、符号位、FEC 码率和调制阶数共同计算。例如对 $m$ bit/符号的一维 PAS 结构，常见表达为

  

$$

R_{\mathrm{PAS}}=H(A)+1-m(1-R_c),

$$

  

具体形式取决于一维/二维建模、符号位处理和系统帧结构。

  

<a id="sec-6-7-ccdm"></a>

### 6.7 CCDM 实现

  

CCDM（Constant Composition Distribution Matching）将均匀二进制序列映射为具有固定 composition 的符号序列。设块长为 $n$，目标 composition 为

  

$$

\mathbf{f}=(f_1,f_2,\ldots,f_M),

\qquad \sum_i f_i=n.

$$

  

不同排列数为多项式系数

  

$$

\binom{n}{\mathbf{f}}=\frac{n!}{\prod_i f_i!}.

$$

  

固定长度 CCDM 编码速率为

  

$$

R_{\mathrm{CCDM}}=rac{\left\lfloor\log_2\binom{n}{\mathbf{f}}\right\rfloor}{n}

\quad \mathrm{bits/symbol}.

$$

  

随着 $n\to\infty$，$R_{\mathrm{CCDM}}$ 收敛到目标分布熵 $H(P)$；有限块长下存在 rate loss。

  

<a id="sec-6-8-references"></a>

### 6.8 参考文献

  

1. Böcherer, G., Steiner, F., & Schulte, P. (2015). “Bandwidth Efficient and Rate-Matched Low-Density Parity-Check Coded Modulation.” *IEEE Transactions on Communications*, 63(12), 4651--4665.

2. Fehenberger, T., Alvarado, A., Böcherer, G., & Hanik, N. (2016). “On Probabilistic Shaping of Quadrature Amplitude Modulation for the Nonlinear Fiber Channel.” *Journal of Lightwave Technology*, 34(21), 5063--5073.

3. Schulte, P., & Böcherer, G. (2016). “Constant Composition Distribution Matching.” *IEEE Transactions on Information Theory*, 62(1), 430--434. DOI: 10.1109/TIT.2015.2499181.

4. Cover, T. M., & Thomas, J. A. (2006). *Elements of Information Theory*, 2nd ed. Wiley.

  

---

  

<a id="sec-7-prng"></a>

## 7. 伪随机数生成算法（PRNG）

  

<a id="sec-7-1-importance"></a>

### 7.1 蒙特卡洛仿真中 PRNG 质量的重要性

  

光纤通信 BER、MI/GMI、罕见事件概率和非线性噪声统计仿真高度依赖随机数质量。应关注：

  

1. 周期是否远大于样本量。

2. 高维均匀性和统计测试表现。

3. 并行流之间是否可构造为不重叠。

4. 是否支持 jump/advance 或 counter-based 随机访问。

5. 跨平台、跨版本是否需要 bit-exact reproducibility。

  

<a id="sec-7-2-mt19937"></a>

### 7.2 梅森旋转算法（MT19937）

  

MT19937 是广义反馈移位寄存器类 PRNG。其主要性质：

  

- 周期：$2^{19937}-1$。

- 623 维等分布（32-bit 精度意义下）。

- 状态较大：624 个 32-bit 字。

- 不适合密码学用途，也不适合需要大量独立并行流的 GPU 仿真。

  

NumPy 旧接口 `RandomState` 使用 MT19937；新接口 `default_rng()` 默认不是 MT19937。

  

```python

import numpy as np

  

# 新接口：默认 BitGenerator 是 PCG64，不是 MT19937

rng = np.random.default_rng(seed=42)

x = rng.standard_normal(10)

  

# 旧接口：RandomState 使用 MT19937

rng_mt_old = np.random.RandomState(seed=42)

y = rng_mt_old.standard_normal(10)

  

# 新接口中显式使用 MT19937

rng_mt = np.random.Generator(np.random.MT19937(seed=42))

z = rng_mt.standard_normal(10)

```

  

<a id="sec-7-3-mrg"></a>

### 7.3 组合多重递归算法（MRG）

  

MRG32k3a 由两个三阶线性递归组合：

  

$$

x_{1,n}=(a_{12}x_{1,n-2}+a_{13}x_{1,n-3})\bmod m_1,

$$

  

$$

x_{2,n}=(a_{21}x_{2,n-1}+a_{23}x_{2,n-3})\bmod m_2,

$$

  

输出可写为

  

$$

u_n=\frac{(x_{1,n}-x_{2,n})\bmod m_1}{m_1}.

$$

  

常用参数：

  

$$

m_1=4294967087,

\qquad m_2=4294944443,

$$

  

$$

a_{12}=1403580,

\qquad a_{13}=-810728,

$$

  

$$

a_{21}=527612,

\qquad a_{23}=-1370589.

$$

  

MRG32k3a 支持 stream/substream 分割，适合严肃并行 Monte Carlo。

  

<a id="sec-7-4-lfg"></a>

### 7.4 滞后斐波那契生成器（LFG）

  

LFG 递推为

  

$$

x_n=(x_{n-j}\circ x_{n-k})\bmod m,

\qquad j<k,

$$

  

其中 $\circ$ 可为加法、乘法或异或。LFG 速度快，但初始化和参数选择敏感；现代高可靠并行仿真中通常优先使用 PCG、MRG32k3a、Philox、Threefry 等更易审计的方案。

  

<a id="sec-7-5-cbrng"></a>

### 7.5 Counter-Based PRNG：Philox 与 Threefry

  

Counter-Based PRNG（CBRNG）将计数器和 key 映射为随机输出：

  

$$

\mathrm{PRNG}(n)=F_{\mathrm{key}}(n).

$$

  

优点：

  

- 无需维护长状态。

- 可随机访问第 $n$ 个输出。

- 天然适合并行线程划分。

- 不同 key/counter 段可构造为不重叠流。

  

#### Philox

  

Philox 通过乘法和 XOR 构造类 Feistel 变换。NumPy 的 `Philox` 是 counter-based BitGenerator，可显式使用：

  

```python

import numpy as np

  

seed = 12345

rng_philox = np.random.Generator(np.random.Philox(seed))

samples = rng_philox.standard_normal(1_000_000)

  

print(samples.mean(), samples.std(ddof=1))

```

  

#### Threefry

  

Threefry 基于 ARX（Add-Rotate-XOR）结构，源自 Threefish/Skein 设计。JAX 默认 PRNG 实现是 `threefry2x32`（除非用户修改配置）。

  

```python

import jax

import jax.numpy as jnp

  

key = jax.random.key(42)

x = jax.random.normal(key, shape=(1_000_000,))

print(jnp.mean(x), jnp.std(x, ddof=1))

```

  

#### PyTorch 注意事项

  

PyTorch 可以通过 `torch.manual_seed()` 控制 CPU 和 CUDA 随机性，但其不同设备、不同算子、不同版本之间不保证完全 bit-exact。若论文要求跨框架完全复现随机序列，不应把 PyTorch 的 RNG 当作可移植标准；应使用显式 PRNG 实现或保存随机种子与样本序列。

  

```python

import torch

  

torch.manual_seed(42)

x_cpu = torch.randn(1_000_000)

  

if torch.cuda.is_available():

torch.cuda.manual_seed_all(42)

x_gpu = torch.randn(1_000_000, device="cuda")

```

  

<a id="sec-7-6-comparison"></a>

### 7.6 算法对比与选用建议

  

| 算法 | 周期/流 | 并行性 | 速度 | 推荐场景 |

|:---|:---|:---|:---|:---|

| MT19937 | $2^{19937}-1$ | 差 | 中 | 单线程历史代码复现 |

| PCG64 | $2^{128}$ 量级 | 较好，支持 advance | 快 | NumPy 新接口默认通用仿真 |

| MRG32k3a | $\approx2^{191}$ | 优，支持流/子流 | 中 | 严肃 CPU 并行 Monte Carlo |

| Philox | counter-based | 极优 | 快 | GPU/TPU/并行仿真，NumPy 可显式调用 |

| Threefry | counter-based | 极优 | 中 | JAX 风格函数式、可分裂 PRNG |

  

实用建议：

  

- 普通 Python 仿真：`np.random.default_rng(seed)` 即可，但论文中应报告 NumPy 版本和 BitGenerator。

- 需要显式并行可复现：优先 Philox、Threefry 或 MRG32k3a。

- GPU 深度学习仿真：记录框架版本、设备、种子、确定性算子设置；不要默认跨平台 bit-exact。

  

<a id="sec-7-7-references"></a>

### 7.7 参考文献

  

1. Salmon, J. K., Moraes, M. A., Dror, R. O., & Shaw, D. E. (2011). “Parallel Random Numbers: As Easy as 1, 2, 3.” *SC '11*.

2. L'Ecuyer, P. (1999). “Good Parameters and Implementations for Combined Multiple Recursive Random Number Generators.” *Operations Research*, 47(1), 159--164.

3. Matsumoto, M., & Nishimura, T. (1998). “Mersenne Twister: A 623-Dimensionally Equidistributed Uniform Pseudo-Random Number Generator.” *ACM TOMACS*, 8(1), 3--30.

4. L'Ecuyer, P., & Simard, R. (2007). “TestU01: A C Library for Empirical Testing of Random Number Generators.” *ACM TOMS*, 33(4), Article 22.

  

---

  

<a id="sec-8-eepn-cycle-slip-gan"></a>

## 8. EEPN、周跳与 GAN 建模

  

<a id="sec-8-1-eepn"></a>

### 8.1 EEPN：均衡增强相位噪声

  

EEPN（Equalization-Enhanced Phase Noise）源于 LO 相位噪声与电子色散补偿（EDC/CDC）的相互作用。

  

在相干接收机中，LO 相位噪声在光电混频时进入接收基带：

  

$$

r(t)=\left[s(t)*h_{\mathrm{fiber}}(t)\right]\exp(j\phi_{\mathrm{LO}}(t))+n(t).

$$

  

随后 CDC 施加大群时延色散。CDC 的相位响应为

  

$$

\angle H_{\mathrm{CDC}}(f)=-\frac{\pi\lambda^2DL}{c}f^2.

$$

  

群时延为

  

$$

\tau_g(f)=-\frac{1}{2\pi}\frac{d}{df}\angle H_{\mathrm{CDC}}(f)

=\frac{\lambda^2DL}{c}f.

$$

  

不同频率分量经历不同群时延，使原本较慢的 LO 相位噪声通过色散补偿转化为等效宽带扰动。这种扰动难以完全由常规 CPE 作为慢变公共相位跟踪掉。

  

<a id="sec-8-2-eepn-power"></a>

### 8.2 EEPN 的等效噪声功率

  

在小相位噪声和线性化条件下，常用 EEPN 方差近似为

  

$$

\boxed{

\sigma_{\mathrm{EEPN}}^2

\approx

\pi\Delta\nu_{\mathrm{LO}}\frac{\lambda^2|D|L}{c}\,R_s

}

$$

  

这里 $\sigma_{\mathrm{EEPN}}^2$ 通常表示归一化相位/符号噪声方差形式；有些文献会把信号功率 $P_s$ 乘入，写成功率噪声形式：

  

$$

P_{\mathrm{EEPN}}\approx

P_s\,\pi\Delta\nu_{\mathrm{LO}}\frac{\lambda^2|D|L}{c}\,R_s.

$$

  

**重要修正**：若写成功率噪声，需要乘以 $P_s$；若写成归一化方差，不乘 $P_s$。此外，量纲中通常需要符号率或等效噪声带宽因子。不同论文对 $T_s$、$R_s$、单边/双边带宽和归一化方式的定义不同，引用时必须核对原式。

  

EEPN 的典型规律是

  

$$

\sigma_{\mathrm{EEPN}}^2\propto

\Delta\nu_{\mathrm{LO}}|D|LR_s.

$$

  

因此长距离、大色散、高符号率和较宽 LO 线宽都会增强 EEPN。

  

<a id="sec-8-3-gan"></a>

### 8.3 用 GAN 建模 EEPN 的随机特性

  

若 EEPN 样本来自实验或高保真仿真，并且其统计特性明显偏离简单高斯/平稳假设，可考虑生成模型。GAN 的标准目标为

  

$$

\min_G\max_D

\mathcal{L}(G,D)

=

\mathbb{E}_{\mathbf{x}\sim p_{\mathrm{data}}}[\log D(\mathbf{x})]

+

\mathbb{E}_{\mathbf{z}\sim p_z}[\log(1-D(G(\mathbf{z})))].

$$

  

但对通信物理建模而言，不建议直接把 GAN 作为首选模型。更稳健的路径是：

  

1. 先验证 EEPN 是否显著：比较含/不含 EEPN 的 EVM、GMI、CPE 残差 PSD 和误码突发统计。

2. 若显著，先建立参数化或半参数化模型，例如 ARMA、状态空间模型、条件高斯过程或谱整形噪声。

3. 仅当简单模型无法拟合高阶统计、条件分布或突发特征时，再考虑 cGAN/WGAN/TimeGAN。

4. GAN 生成样本必须用物理指标验证：PSD、ACF、相位增量分布、尾部概率、GMI/BER 影响，而不能只看判别器 loss。

  

<a id="sec-8-4-cycle-slip"></a>

### 8.4 周跳（Cycle Slip）

  

对具有四重旋转对称性的 QAM，CPE 存在 $\pi/2$ 模糊：

  

$$

\hat{\phi}(n)=\phi(n)+k\frac{\pi}{2},

\qquad k\in\mathbb{Z}.

$$

  

若估计分支从一个 $k$ 跳到另一个 $k$，则发生 cycle slip。周跳后星座整体旋转 $k\pi/2$，若没有差分编码、导频或 FEC 辅助纠正，会产生突发错误。

  

触发因素包括：

  

1. 瞬时 SNR 下降。

2. 相位噪声在 CPE 窗口内快速变化。

3. 判决导向 CPE 中错误判决反馈。

4. EEPN 或非线性相位噪声导致的异常相位扰动。

  

周跳概率强烈依赖算法、SNR、线宽、窗口长度和导频结构；简单闭式近似只能作为定性参考，不能替代仿真或实验统计。

  

<a id="sec-8-5-pilot-cpe"></a>

### 8.5 导频辅助 CPE 缓解周跳

  

导频以固定间隔 $N_p$ 插入：

  

```text

| P | D D D ... D | P | D D D ... D | P |

```

  

导频开销近似为

  

$$

\rho_p=\frac{1}{N_p}.

$$

  

导频位置相位估计为

  

$$

\hat{\phi}(n_p)=\angle\left[r(n_p)s_p^*(n_p)\right].

$$

  

导频提供无 $\pi/2$ 模糊的相位锚点，可用于：

  

1. 校正 BPS 输出的相位分支。

2. 检测两个导频之间是否出现 $k\pi/2$ 跳变。

3. 与 Kalman/Rauch--Tung--Striebel smoother 结合，在导频间插值或平滑相位。

  

线性插值形式为

  

$$

\hat{\phi}(n)=\hat{\phi}(n_{p,m})

+\frac{n-n_{p,m}}{n_{p,m+1}-n_{p,m}}

\left[\hat{\phi}(n_{p,m+1})-\hat{\phi}(n_{p,m})\right].

$$

  

更合理的做法是在 Wiener 相位噪声模型下使用 Kalman 平滑，因为相位不是确定性线性轨迹。

  

导频间隔越小，周跳检测越快，但净速率越低：

  

$$

R_{\mathrm{net}}

\propto

(1-\rho_p)R_sR_{\mathrm{info}}.

$$

  

<a id="sec-8-6-summary"></a>

### 8.6 综合理解

  

```text

EEPN

├── 来源：LO 相位噪声 × CDC 群时延色散

├── 规律：方差随 Δν_LO、|D|、L、R_s 增大

├── 表现：CPE 后残余相位/幅度扰动，可能呈宽带或有色噪声

└── 建模：优先物理/统计模型；GAN 仅作为复杂残差分布模型候选

  

周跳

├── 来源：CPE 的相位模糊 + 噪声/快速相位扰动

├── 表现：相位估计分支跳变 kπ/2，造成突发错误

└── 对策：导频、差分编码、FEC 辅助、Kalman 平滑、周跳检测

```

  

<a id="sec-8-7-references"></a>

### 8.7 参考文献

  

1. Shieh, W., & Ho, K. P. (2008). “Equalization-enhanced phase noise for coherent-detection systems using electronic digital signal processing.” *Optics Express*, 16(20), 15718--15727.

2. Lau, A. P. T., & Kahn, J. M. (2007). “Signal Design and Detection in Presence of Nonlinear Phase Noise.” *Journal of Lightwave Technology*, 25(10), 3008--3016.

3. Goodfellow, I. et al. (2014). “Generative Adversarial Nets.” *NeurIPS*, 27.

4. Colavolpe, G., Barbieri, A., & Caire, G. (2005). “Algorithms for iterative decoding in the presence of strong phase noise.” *IEEE Journal on Selected Areas in Communications*, 23(9), 1748--1757.

5. Pfau, T., Hoffmann, S., & Noé, R. (2009). See Section 2.6.

  

---

  

<a id="appendix-a-symbols"></a>

## 附录 A：符号说明

  

| 符号 | 含义 | 常见单位 |

|:---|:---|:---|

| $D$ | 色散系数 | ps/(nm·km) |

| $\beta_2$ | GVD 参数 | ps²/km |

| $\alpha$ | 衰减系数 | 1/km 或 dB/km |

| $\gamma$ | 非线性系数 | W⁻¹km⁻¹ |

| $L_{\mathrm{eff}}$ | 有效长度 | km |

| $\Delta\nu$ | 激光线宽 | Hz |

| $T_s$ | 符号周期 | s |

| $R_s$ | 符号率 | Baud |

| $f_s$ | 采样率 | Sa/s |

| $\alpha_{\mathrm{RC}}$ | RC/RRC roll-off | 无量纲 |

| $\nu$ | PCS MB 成形参数 | 取决于星座归一化 |

| $\sigma^2$ | 噪声方差 | 与信号归一化一致 |

| $I(X;Y)$ | 互信息 | bits/symbol |

| GMI | 广义互信息 | bits/symbol |

| $\mu$ | 自适应滤波步长 | 无量纲或归一化量 |

| $N_B$ | BPS 半窗口长度 | symbols |

| $N_p$ | 导频间隔 | symbols |

  

---

  

<a id="appendix-b-resources"></a>

## 附录 B：推荐学习资源

  

### 教材

  

| 书名 | 作者 | 适用章节 |

|:---|:---|:---|

| *Fiber-Optic Communication Systems* | Govind P. Agrawal | 系统基础、Q 因子、噪声分析 |

| *Nonlinear Fiber Optics* | Govind P. Agrawal | NLSE、SPM、XPM、孤子与非线性传播 |

| *Digital Communications* | Proakis & Salehi | 脉冲成形、均衡、同步 |

| *Elements of Information Theory* | Cover & Thomas | 熵、MI、信道容量 |

| *Optical Fiber Telecommunications VII* | Willner, ed. | 相干系统、DSP、网络与器件综述 |

  

### Python 工具库

  

```python

# 数值计算

import numpy as np

import scipy.signal as signal

  

# 推荐的显式 PRNG 写法

rng = np.random.default_rng(2026) # 默认 PCG64

rng_philox = np.random.Generator(np.random.Philox(2026))

  

# 通信仿真：scikit-commpy 的包名通常是 commpy

# pip install scikit-commpy

# import commpy

  

# 光纤通信仿真可参考 OptiCommPy

# https://github.com/edsonportosilva/OptiCommPy

  

# 深度学习/可微仿真

import torch

# import jax

```

  

### 最小可复现随机数示例

  

```python

import numpy as np

  

SEED = 2026

N = 1_000_000

  

rng = np.random.default_rng(SEED)

x = rng.standard_normal(N)

  

print(f"mean={x.mean():.4e}")

print(f"std={x.std(ddof=1):.4f}")

  

# 期望：mean 接近 0，std 接近 1；具体数值随 BitGenerator/版本变化。

```

  

### PRNG 统计测试工具

  

- TestU01：L'Ecuyer 与 Simard 的 C 语言随机数统计测试库。

- PractRand：适合长序列流式测试。

  

---

  

<a id="appendix-c-review"></a>

## 附录 C：仍建议人工复核的点

  

1. **CDC 符号约定**：本文采用一种常见 Fourier 变换约定。若仿真代码使用 $\exp(+j\omega t)$ 或 $\exp(-j\omega t)$ 的相反约定，色散算子的正负号需要同步调整。

2. **PMD/MIMO 更新式**：本文给出的是 $\hat{s}=\mathbf{w}^H\mathbf{r}$ 约定下的复数 LMS/CMA 写法。代码实现若使用行向量或无共轭转置，更新式共轭位置必须相应修改。

3. **EEPN 方差公式**：不同文献对归一化噪声、符号率、噪声带宽和单边/双边 PSD 的定义不同。本文已修正原文量纲问题，但最终用于论文时应直接引用 Shieh & Ho 原式并保持符号一致。

4. **PCS AIR/PAS 速率**：具体系统的净速率应按实际 PAS 架构、FEC 码率、导频开销、PCS rate loss 和 framing overhead 计算；不要只用 `MI / (1+OH)` 替代完整链路预算。

5. **PRNG 跨平台复现**：NumPy/JAX/PyTorch 的随机数算法和默认设置可能随版本变化。论文复现实验应记录库版本、BitGenerator、seed、设备和确定性设置。