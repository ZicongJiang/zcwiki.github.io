# 光纤相干通信系统知识点笔记

  

> 目标：把相干光纤通信系统中的常见术语统一到同一个数学框架下，便于读论文、搭建仿真链路、解释 DSP/DT 模型中哪些损伤应当建模、哪些损伤可由接收机 DSP 缓解。

> 记号约定：除非特别说明，$T_s=1/R_s$ 为符号周期，$R_s$ 为符号率，$\omega=2\pi f$ 为角频率，粗体 $\mathbf{x}$ 表示双偏振 Jones 向量。

---

## 目录

  

1. [系统级基带模型](#1-系统级基带模型)

2. [Q 因子、BER 与 OSNR](#2-q-因子ber-与-osnr)

3. [接收机 DSP：CDC、MIMO 均衡、FOE、CPE](#3-接收机-dspcdcmimo-均衡foecpe)

4. [为什么 DSP 对 PMD 与 PN 的处理可以缓解时变效应](#4-为什么-dsp-对-pmd-与-pn-的处理可以缓解时变效应)

5. [发送机 DSP：Pulse shaping、Resampling、Precompensation](#5-发送机-dsppulse-shapingresamplingprecompensation)

6. [信道非线性：SPM、XPM、ASE-NL 交叉项与平均非线性](#6-信道非线性spmxpmase-nl-交叉项与平均非线性)

7. [PCS、Maxwell-Boltzmann 分布与 Mutual Information](#7-pcsmaxwell-boltzmann-分布与-mutual-information)

8. [数值仿真中的 PRNG 算法族](#8-数值仿真中的-prng-算法族)

9. [EEPN 与 Cycle Slip：如何理解原文那段话](#9-eepn-与-cycle-slip如何理解原文那段话)

10. [建模与仿真建议](#10-建模与仿真建议)

11. [参考文献](#11-参考文献)

  

---

  

## 1. 系统级基带模型

  

相干光通信系统的核心思想是：接收端不仅检测光强，还通过本振光（local oscillator, LO）恢复光场的复包络，因此可以在数字域处理幅度、相位、频率、偏振和色散损伤。

  

双偏振复基带发送信号可以写成

  

$$

\mathbf{s}(t)=\sum_{k} \mathbf{x}_k\, p(t-kT_s),

\qquad

\mathbf{x}_k=

\begin{bmatrix}

x_{X,k}\\

x_{Y,k}

\end{bmatrix},

$$

  

其中 $p(t)$ 是发射脉冲成形滤波器，$\mathbf{x}_k$ 是两个偏振上的调制符号。例如 DP-16QAM 中，$x_{X,k}$ 和 $x_{Y,k}$ 分别来自 16QAM 星座。

  

光纤中较常用的简化传播模型是标量 NLSE 或双偏振 Manakov 方程。忽略高阶色散和受激散射时，双偏振包络 $\mathbf{A}(z,t)$ 可近似满足

  

$$

\frac{\partial \mathbf{A}}{\partial z}

=

-\frac{\alpha}{2}\mathbf{A}

-j\frac{\beta_2}{2}\frac{\partial^2\mathbf{A}}{\partial t^2}

+j\frac{8}{9}\gamma \|\mathbf{A}\|^2\mathbf{A}

+\mathbf{n}_{\mathrm{ASE}}(z,t),

$$

  

其中：

  

- $\alpha$：光纤损耗系数；

- $\beta_2$：群速度色散参数；

- $\gamma$：Kerr 非线性系数；

- $\mathbf{n}_{\mathrm{ASE}}$：光放大器引入的 ASE 噪声；

- $8/9$：随机双折射平均后的 Manakov 非线性系数，具体因子依赖归一化方式。

  

接收端经过相干混频、ADC、前端校准之后，一个常用离散基带模型是

  

$$

\mathbf{r}_k =

e^{j(2\pi \Delta f kT_s+\phi_k)}

\sum_{\ell} \mathbf{H}_{\ell,k}\mathbf{x}_{k-\ell}

+\mathbf{n}_k,

$$

  

其中：

  

- $\Delta f=f_{\mathrm{Tx}}-f_{\mathrm{LO}}$ 是发送激光器和本振激光器的频率偏移；

- $\phi_k$ 是激光相位噪声；

- $\mathbf{H}_{\ell,k}$ 是色散、PMD、偏振旋转、滤波响应等线性损伤的等效 MIMO 信道；

- $\mathbf{n}_k$ 包括 ASE、量化噪声、非线性残差等。

  

接收机 DSP 的主要任务就是尽可能把 $\mathbf{r}_k$ 还原成 $\mathbf{x}_k$ 或其软信息：

  

$$

\mathbf{r}_k

\;\xrightarrow{\mathrm{CDC}}\;

\;\xrightarrow{\mathrm{MIMO\ equalizer}}\;

\;\xrightarrow{\mathrm{FOE}}\;

\;\xrightarrow{\mathrm{CPE}}\;

\;\xrightarrow{\mathrm{demapper/FEC}}\;

\hat{\mathbf{x}}_k.

$$

  

---

  

## 2. Q 因子、BER 与 OSNR

  

### 2.1 经典二进制强度检测中的 Q 因子

  

在早期 IM/DD 或 OOK 系统中，Q 因子常定义为两个判决电平之间的归一化距离：

  

$$

Q=\frac{\mu_1-\mu_0}{\sigma_1+\sigma_0},

$$

  

其中 $\mu_1,\mu_0$ 分别是发送 “1” 和 “0” 时判决变量的均值，$\sigma_1,\sigma_0$ 是对应噪声标准差。

  

若两个电平的噪声近似高斯，并且判决门限取在使两侧误判概率相等的位置，则 BER 近似为

  

$$

\mathrm{BER}

\approx

\frac{1}{2}\operatorname{erfc}\left(\frac{Q}{\sqrt{2}}\right).

$$

  

反过来，如果已知 BER，也常定义一个等效 Q 因子：

  

$$

Q_{\mathrm{eff}}

=

\sqrt{2}\operatorname{erfc}^{-1}(2\mathrm{BER}).

$$

  

工程上也常使用 dB 表示：

  

$$

Q_{\mathrm{dB}} = 20\log_{10}Q.

$$

  

注意：有些文献写 $Q^2_{\mathrm{dB}}=10\log_{10}(Q^2)$，数值上等价于 $20\log_{10}Q$。阅读论文时要确认作者使用的是 $Q$ 还是 $Q^2$。

  

### 2.2 相干 QAM 系统中的 Q 因子

  

对高阶 QAM 相干系统，经典 OOK Q 因子不再是最自然的度量。更常见的是：

  

1. 直接测 pre-FEC BER；

2. 用 BER 反推出 $Q_{\mathrm{eff}}$；

3. 用 EVM 或 SNR 估计性能；

4. 用 MI/GMI/NGMI 评估软判决 FEC 的可达信息率。

  

若信道近似 AWGN，接收星座满足

  

$$

Y=X+N,\qquad N\sim \mathcal{CN}(0,N_0),

$$

  

则根均方 EVM 定义为

  

$$

\mathrm{EVM}_{\mathrm{rms}}^2

=

\frac{\mathbb{E}[|Y-X|^2]}{\mathbb{E}[|X|^2]}

\approx

\frac{1}{\mathrm{SNR}}.

$$

  

因此可用

  

$$

\mathrm{SNR}\approx \frac{1}{\mathrm{EVM}_{\mathrm{rms}}^2}

$$

  

粗略连接 EVM 与性能。对方形 $M$-QAM，在 Gray 映射、AWGN、高 SNR 条件下，符号错误率可近似为

  

$$

P_s

\approx

4\left(1-\frac{1}{\sqrt{M}}\right)

Q_{\mathrm{Gauss}}\left(

\sqrt{\frac{3\gamma_s}{M-1}}

\right),

$$

  

其中 $\gamma_s=E_s/N_0$，$Q_{\mathrm{Gauss}}(x)=\frac{1}{\sqrt{2\pi}}\int_x^\infty e^{-u^2/2}\,du$。比特错误率常粗略取

  

$$

P_b\approx \frac{P_s}{\log_2 M}.

$$

  

这个近似只适合均匀 QAM 与 AWGN 近似；对 PCS-QAM，BER 与星座先验概率、软解调 LLR、FEC 码率有关，MI/GMI 通常更有解释力。

  

### 2.3 OSNR 与 SNR 的关系

  

OSNR 定义为光信号功率与参考带宽内噪声功率之比。常用参考带宽是 $0.1~\mathrm{nm}$，在 $1550~\mathrm{nm}$ 附近约等于

  

$$

B_{\mathrm{ref}}\approx 12.5~\mathrm{GHz}.

$$

  

若 ASE 噪声功率谱密度近似平坦，则

  

$$

\mathrm{OSNR}_{0.1\mathrm{nm}}

=

\frac{P_{\mathrm{sig}}}{N_{\mathrm{ASE}}B_{\mathrm{ref}}}.

$$

  

匹配滤波之后，电域符号 SNR 和 OSNR 的常用近似关系为

  

$$

\mathrm{SNR}_{\mathrm{sym}}

\approx

\mathrm{OSNR}_{\mathrm{lin}}

\frac{B_{\mathrm{ref}}}{R_s\,\eta_{\mathrm{BW}}},

$$

  

其中 $\eta_{\mathrm{BW}}$ 用来吸收噪声带宽、roll-off、偏振功率归一化、单边/双边 PSD 定义等约定。很多工程论文会给出看似不同的系数，原因通常是 OSNR 是总功率还是单偏振功率、噪声 PSD 是否按双偏振计、接收滤波器等效噪声带宽如何定义。

  

更稳妥的流程是：

  

$$

\mathrm{OSNR}

\rightarrow

\mathrm{SNR/EVM}

\rightarrow

\mathrm{BER/GMI/NGMI}

\rightarrow

\mathrm{FEC\ margin}.

$$

  

---

  

## 3. 接收机 DSP：CDC、MIMO 均衡、FOE、CPE

  

### 3.1 CDC：Chromatic Dispersion Compensation，色散补偿

  

#### 3.1.1 色散的物理含义

  

色散来自传播常数 $\beta(\omega)$ 对频率的非线性依赖。对载频 $\omega_0$ 附近展开：

  

$$

\beta(\omega_0+\Omega)

=

\beta_0+\beta_1\Omega+\frac{1}{2}\beta_2\Omega^2+\cdots.

$$

  

其中 $\beta_1$ 对应群时延，$\beta_2$ 对应群速度色散。忽略非线性和损耗，在随群速度移动的参考系中，

  

$$

\frac{\partial A}{\partial z}

=

-j\frac{\beta_2}{2}\frac{\partial^2 A}{\partial t^2}.

$$

  

对时间做傅里叶变换，有

  

$$

\tilde{A}(L,\Omega)

=

\tilde{A}(0,\Omega)

H_{\mathrm{CD}}(\Omega),

$$

  

在本文采用的傅里叶号约下可以写成

  

$$

H_{\mathrm{CD}}(\Omega)=

\exp\left(j\frac{\beta_2 L}{2}\Omega^2\right).

$$

  

不同文献的傅里叶变换符号可能导致指数正负号相反；实际实现时只需要保证补偿滤波器是传输滤波器的逆：

  

$$

H_{\mathrm{CDC}}(\Omega)

=

H_{\mathrm{CD}}^{-1}(\Omega)

=

\exp\left(-j\frac{\beta_2 L}{2}\Omega^2\right).

$$

  

工程中也常用色散参数 $D$：

  

$$

\beta_2=-\frac{D\lambda^2}{2\pi c}.

$$

  

#### 3.1.2 CDC 的实现方式

  

**频域 CDC** 最常见。对接收序列分块 FFT：

  

$$

R_m[\nu]=\mathrm{FFT}\{r_m[n]\},

$$

  

乘以逆色散响应：

  

$$

\hat{X}_m[\nu]=R_m[\nu]H_{\mathrm{CDC}}[\nu],

$$

  

再 IFFT 回时域。为避免循环卷积伪影，通常使用 overlap-save 或 overlap-add。

  

**时域 CDC** 可把 $H_{\mathrm{CDC}}(\Omega)$ 采样后 IFFT 得到 FIR 滤波器，但长距离链路需要很长的抽头，复杂度高。

  

CDC 的本质是补偿确定性的线性相位畸变。它不直接去除 ASE 噪声，也不能完全消除 Kerr 非线性造成的信号-噪声耦合。

  

---

  

### 3.2 MIMO 均衡器：偏振解复用与 PMD 补偿

  

双偏振相干系统的线性信道可写成 2×2 MIMO FIR：

  

$$

\mathbf{y}[n]

=

\sum_{\ell=0}^{L_h-1}

\mathbf{H}_{\ell}

\mathbf{x}[n-\ell]

+

\mathbf{v}[n],

$$

  

其中

  

$$

\mathbf{H}_{\ell}

=

\begin{bmatrix}

h_{XX,\ell} & h_{XY,\ell}\\

h_{YX,\ell} & h_{YY,\ell}

\end{bmatrix}.

$$

  

MIMO 均衡器也是 2×2 FIR：

  

$$

\mathbf{z}[n]

=

\sum_{m=0}^{L_w-1}

\mathbf{W}_{m}

\mathbf{y}[n-m].

$$

  

理想情况下，在频域满足

  

$$

\mathbf{W}(e^{j\omega})\mathbf{H}(e^{j\omega})

\approx

c\,e^{-j\omega d}\mathbf{I},

$$

  

其中 $c$ 是复增益，$d$ 是整体延迟。

  

#### 3.2.1 PMD 的 Jones 模型

  

一阶 PMD 可写成

  

$$

\mathbf{H}_{\mathrm{PMD}}(\omega)

=

\mathbf{U}

\begin{bmatrix}

e^{-j\omega\tau/2} & 0\\

0 & e^{j\omega\tau/2}

\end{bmatrix}

\mathbf{V}^{\dagger},

$$

  

其中：

  

- $\mathbf{U},\mathbf{V}$ 是单位ary Jones 矩阵，描述输入/输出偏振基旋转；

- $\tau$ 是 differential group delay, DGD；

- $\dagger$ 表示 Hermitian 转置。

  

若 $\tau$ 很小，PMD 主要表现为偏振旋转；若 $\tau$ 与 $T_s$ 可比，PMD 会引入明显的偏振相关 ISI，需要多抽头 MIMO 均衡器补偿。

  

#### 3.2.2 CMA、MMA 与 DD-LMS

  

常见自适应均衡算法包括：

  

**CMA（Constant Modulus Algorithm）**

对 QPSK 等近似恒模信号有效。令输出为 $z_i[n]$，代价函数

  

$$

J_{\mathrm{CMA}}

=

\mathbb{E}\left[

(|z_i[n]|^2-R)^2

\right],

$$

  

其中

  

$$

R=\frac{\mathbb{E}[|x|^4]}{\mathbb{E}[|x|^2]}.

$$

  

权重按随机梯度下降更新：

  

$$

\mathbf{w}_{i}[n+1]

=

\mathbf{w}_{i}[n]

-

\mu

\left(|z_i[n]|^2-R\right)z_i[n]\mathbf{y}^*[n].

$$

  

**MMA（Multi-Modulus Algorithm）**

对 QAM 更合适，因为 QAM 不是恒模星座。MMA 常分别约束实部和虚部的模值：

  

$$

J_{\mathrm{MMA}}

=

\mathbb{E}

\left[

(z_{I}^2-R_I)^2+(z_{Q}^2-R_Q)^2

\right].

$$

  

**DD-LMS（Decision-Directed LMS）**

均衡器初步收敛后，用硬判决或软判决符号 $\hat{x}[n]$ 作为参考：

  

$$

e[n]=z[n]-\hat{x}[n],

$$

  

$$

\mathbf{w}[n+1]

=

\mathbf{w}[n]-\mu e[n]\mathbf{y}^*[n].

$$

  

DD-LMS 的优点是跟踪精度高，缺点是初始误判或 cycle slip 会导致错误传播。因此实际 DSP 常采用 CMA/MMA 启动，再切换到 DD-LMS 或 RDE/MMA 的混合策略。

  

---

  

### 3.3 FOE：Frequency Offset Estimation，频偏估计

  

发送激光器和本振激光器频率不完全一致，导致接收符号出现线性相位旋转：

  

$$

y_k=x_k e^{j(2\pi \Delta f kT_s+\phi_0)}+n_k.

$$

  

FOE 的任务是估计 $\Delta f$，并做反旋转：

  

$$

\tilde{y}_k

=

y_k e^{-j2\pi \hat{\Delta f}kT_s}.

$$

  

若残余频偏太大，CPE 会被迫跟踪一个持续线性相位斜率，容易失锁或产生 cycle slip。

  

常用 FOE 思路：

  

#### 3.3.1 M 次方法

  

对 $M$-PSK，$x_k^M$ 去除了调制相位：

  

$$

y_k^M

=

x_k^M e^{jM(2\pi \Delta f kT_s+\phi_0)}

\approx

C e^{jM2\pi \Delta f kT_s}.

$$

  

可以通过 FFT 找峰或相位差估计 $\Delta f$。

该方法对 PSK 自然，对 QAM 需要改造，例如 QPSK partitioning、星座分区、导频辅助等。

  

#### 3.3.2 相位增量法

  

若有粗判决 $\hat{x}_k$，可先去调制：

  

$$

u_k=y_k\hat{x}_k^*.

$$

  

然后估计相邻相位差：

  

$$

\hat{\Delta f}

=

\frac{1}{2\pi T_s}

\arg

\left(

\sum_k u_k u_{k-1}^*

\right).

$$

  

这个方法简单，但依赖初始判决质量。

  

#### 3.3.3 导频辅助 FOE

  

插入已知导频 $p_k$，用

  

$$

u_k=y_k p_k^*

$$

  

估计相位斜率。这在高阶 QAM、PCS-QAM 或低 SNR 条件下更稳健，但会牺牲少量净速率。

  

---

  

### 3.4 CPE：Carrier Phase Estimation，载波相位估计

  

激光相位噪声常用 Wiener 过程建模：

  

$$

\phi_k=\phi_{k-1}+\Delta\phi_k,

$$

  

$$

\Delta\phi_k\sim

\mathcal{N}

\left(

0,\,

2\pi(\Delta\nu_{\mathrm{Tx}}+\Delta\nu_{\mathrm{LO}})T_s

\right),

$$

  

其中 $\Delta\nu_{\mathrm{Tx}},\Delta\nu_{\mathrm{LO}}$ 是发送激光器和本振激光器线宽。

  

CPE 要估计 $\phi_k$ 并补偿：

  

$$

\tilde{y}_k=y_k e^{-j\hat{\phi}_k}.

$$

  

#### 3.4.1 Viterbi-Viterbi CPE

  

对 $M$-PSK，可用 $M$ 次方去调制：

  

$$

\hat{\phi}_k

=

\frac{1}{M}

\arg

\left(

\sum_{i=-N}^{N} y_{k+i}^{M}

\right).

$$

  

该方法简单，但天然适配 PSK；对 QAM 需要星座分区或其他改造。

  

#### 3.4.2 Blind Phase Search, BPS

  

BPS 是相干 QAM 中很经典的 CPE 方法。对每个候选相位 $\theta_b$，计算旋转后的符号到最近星座点的距离：

  

$$

d_b[k]

=

\sum_{i=-N}^{N}

\left|

y_{k+i}e^{-j\theta_b}

-

\mathcal{Q}\left(y_{k+i}e^{-j\theta_b}\right)

\right|^2,

$$

  

其中 $\mathcal{Q}(\cdot)$ 是最近星座点判决。选择代价最小的相位：

  

$$

\hat{\phi}_k=\arg\min_{\theta_b} d_b[k].

$$

  

BPS 优点是适配任意 QAM，鲁棒性强；缺点是复杂度高，且在低 SNR 或相位噪声较强时仍可能 cycle slip。

  

#### 3.4.3 导频辅助 CPE

  

导频符号相位已知。若第 $m$ 个导频位置为 $k_m$，则

  

$$

\hat{\phi}_{k_m}

=

\arg(y_{k_m}p_{k_m}^*).

$$

  

数据符号的相位可通过线性插值、Wiener 滤波、Kalman 滤波或样条插值得到：

  

$$

\hat{\phi}_{k}

=

\mathrm{Interp}\left(\{\hat{\phi}_{k_m}\}\right).

$$

  

导频辅助 CPE 的核心价值不是“完全消除相位噪声”，而是给相位轨迹提供绝对锚点，降低相位估计的模糊性和 cycle slip 概率。

  

---

  

## 4. 为什么 DSP 对 PMD 与 PN 的处理可以缓解时变效应

  

PMD 和 PN 都是时变损伤，但它们的时变尺度通常比符号周期慢得多，因此可以由自适应 DSP 跟踪。

  

### 4.1 PMD 的时变性与 MIMO 均衡跟踪

  

PMD 来自光纤双折射。环境温度、机械应力、振动会改变光纤的主偏振态和 DGD。因此 $\mathbf{H}_{\ell,k}$ 随时间变化：

  

$$

\mathbf{y}[n]

=

\sum_{\ell}

\mathbf{H}_{\ell}(n)

\mathbf{x}[n-\ell]

+

\mathbf{v}[n].

$$

  

自适应 MIMO 均衡器本质上是在在线估计 $\mathbf{H}_{\ell}(n)$ 的逆。若信道变化时间常数 $\tau_{\mathrm{PMD}}$ 远大于均衡器收敛时间 $\tau_{\mathrm{eq}}$，即

  

$$

\tau_{\mathrm{PMD}}\gg \tau_{\mathrm{eq}},

$$

  

则均衡器能稳定跟踪。

  

自适应步长 $\mu$ 存在折中：

  

- $\mu$ 大：跟踪快，但稳态误差和噪声增强大；

- $\mu$ 小：稳态误差小，但对快速偏振扰动跟踪不足。

  

因此“DSP 可以缓解 PMD 时变效应”的严格前提是：PMD 变化速度在均衡器跟踪带宽内，且 DGD 没有超过均衡器抽头长度可覆盖的记忆长度。

  

### 4.2 PN 的时变性与 FOE/CPE 跟踪

  

相位噪声可看作随机游走：

  

$$

\phi_k=\phi_{k-1}+\Delta\phi_k.

$$

  

FOE 先去除确定性线性相位项：

  

$$

2\pi \Delta f kT_s,

$$

  

CPE 再跟踪随机相位项 $\phi_k$。

  

CPE 的窗口长度或环路带宽同样存在折中：

  

- 窗口长：噪声平均更充分，但无法跟踪快速相位漂移；

- 窗口短：跟踪快，但估计方差大；

- 高阶 QAM：星座点间相位裕量小，对相位误差更敏感；

- PCS-QAM：点概率不均匀，CPE 代价函数最好考虑先验概率，否则可能有偏。

  

因此 DSP 不是让 PN 消失，而是把低频、慢变、可估计的相位漂移从信号中剥离。不可跟踪的快速相位扰动仍表现为相位噪声残差，进入 BER/GMI penalty。

  

---

  

## 5. 发送机 DSP：Pulse shaping、Resampling、Precompensation

  

### 5.1 Pulse shaping：RRC 滤波与 Nyquist 零 ISI

  

发送端 pulse shaping 把离散符号变成连续时间波形：

  

$$

s(t)=\sum_k a_k p(t-kT_s).

$$

  

若接收端匹配滤波后的总脉冲为 $g(t)$，满足

  

$$

g(nT_s)=

\begin{cases}

1, & n=0,\\

0, & n\ne 0,

\end{cases}

$$

  

则在理想采样时刻无符号间干扰（ISI）。这就是 Nyquist 零 ISI 条件。

  

Raised-cosine 频响常写成

  

$$

H_{\mathrm{RC}}(f)=

\begin{cases}

T_s, & |f|\le \frac{1-\alpha}{2T_s},\\[4pt]

\frac{T_s}{2}

\left[

1+\cos\left(

\frac{\pi T_s}{\alpha}

\left(

|f|-\frac{1-\alpha}{2T_s}

\right)

\right)

\right],

&

\frac{1-\alpha}{2T_s}<|f|\le \frac{1+\alpha}{2T_s},\\[4pt]

0, & |f|>\frac{1+\alpha}{2T_s}.

\end{cases}

$$

  

其中 $\alpha$ 是 roll-off factor。带宽随 $\alpha$ 增大而增大：

  

$$

B_{\mathrm{one-sided}}

=

\frac{1+\alpha}{2T_s}.

$$

  

Root-raised-cosine, RRC, 是 raised-cosine 的平方根：

  

$$

H_{\mathrm{RRC}}(f)H_{\mathrm{RRC}}(f)=H_{\mathrm{RC}}(f).

$$

  

通常发送端用 RRC，接收端也用 RRC，合起来得到 RC，从而兼顾带宽控制和匹配滤波。

  

**工程作用：**

  

1. 限制信号带宽，提升频谱效率；

2. 控制 ISI；

3. 适配 WDM 频道间隔；

4. 降低 DAC/模拟前端带外镜像和滤波压力。

  

### 5.2 Resampling：速率匹配

  

仿真或实验中，DSP 内部采样率、DAC 采样率、ADC 采样率、符号率往往不满足整数关系。例如：

  

$$

F_{\mathrm{DSP}}=sps\cdot R_s,

$$

  

但 DAC 采样率是固定的 $F_{\mathrm{DAC}}$。需要重采样：

  

$$

\frac{F_{\mathrm{out}}}{F_{\mathrm{in}}}=\frac{L}{M}.

$$

  

常用实现是：

  

1. 插值 $L$ 倍；

2. 低通抗镜像滤波；

3. 抽取 $M$ 倍。

  

数学上，重采样是把信号从一个采样网格映射到另一个采样网格。若滤波器设计不当，会引入：

  

- aliasing；

- passband ripple；

- 群时延畸变；

- 采样时钟偏差导致的 timing drift。

  

在相干系统中，resampling 不只是“改变数组长度”，而是保持连续时间波形等效性的关键步骤。

  

### 5.3 Precompensation：发射机带宽、I/Q skew、链路时延预补偿

  

发射机模拟链路包括 DAC、驱动器、RF 线缆、IQ 调制器、偏置控制、封装走线等。它们会引入频率响应畸变：

  

$$

Y(f)=H_{\mathrm{Tx}}(f)X(f).

$$

  

若已测得或估计 $H_{\mathrm{Tx}}(f)$，可在发送 DSP 中加入预补偿滤波器：

  

$$

X_{\mathrm{pre}}(f)=H_{\mathrm{pre}}(f)X(f),

$$

  

目标是

  

$$

H_{\mathrm{Tx}}(f)H_{\mathrm{pre}}(f)\approx 1.

$$

  

直接取 $H_{\mathrm{pre}}=1/H_{\mathrm{Tx}}$ 会在 $|H_{\mathrm{Tx}}|$ 很小的频点放大噪声和量化误差，因此实际常用正则化逆：

  

$$

H_{\mathrm{pre}}(f)

=

\frac{H_{\mathrm{Tx}}^*(f)}

{|H_{\mathrm{Tx}}(f)|^2+\lambda}.

$$

  

其中 $\lambda>0$ 控制噪声增强。

  

#### 5.3.1 带宽预补偿

  

若 DAC/driver/modulator 存在有限 3-dB 带宽，信号高频成分被压低，导致：

  

- 眼图闭合；

- QAM 星座点扩散；

- ISI 增强；

- 高波特率系统 OSNR penalty 增加。

  

带宽预补偿就是在发射端预增强高频分量，使经过模拟低通后总响应更平坦。

  

#### 5.3.2 I/Q skew 与高速线缆时延预补偿

  

I 路和 Q 路，或者 X/Y 偏振的多条高速电缆/走线，可能存在相对时延 $\tau$。例如 Q 路延迟，则

  

$$

s_{\mathrm{IQ}}(t)=I(t)+jQ(t-\tau).

$$

  

频域上，延迟对应线性相位：

  

$$

Q(f)\rightarrow Q(f)e^{-j2\pi f\tau}.

$$

  

预补偿就是提前加入相反相位斜率：

  

$$

Q_{\mathrm{pre}}(f)=Q(f)e^{j2\pi f\tau}.

$$

  

如果不补偿，I/Q 正交性被破坏，表现为星座椭圆、镜像泄漏、EVM 增大。高速光模块中“高速光缆/电缆时延”通常指不同高速通道之间的 group delay mismatch。预补偿的目标是让多路高速波形在调制器电极或光域合成点上时间对齐。

  

#### 5.3.3 发射机非线性预失真

  

IQ 调制器、驱动器、DAC 可能存在非线性。可用 memory polynomial 表示：

  

$$

y[n]

=

\sum_{p\in \mathcal{P}}

\sum_{m=0}^{M}

a_{p,m}x[n-m]|x[n-m]|^{p-1}.

$$

  

预失真器试图学习其逆映射。该部分比线性带宽预补偿更复杂，通常需要训练序列和间接学习架构（indirect learning architecture）。

  

---

  

## 6. 信道非线性：SPM、XPM、ASE-NL 交叉项与平均非线性

  

### 6.1 Kerr 非线性

  

光纤折射率随光强变化：

  

$$

n=n_0+n_2 I.

$$

  

这会导致光场的相位积累依赖瞬时功率。非线性系数常写成

  

$$

\gamma

=

\frac{n_2\omega_0}{cA_{\mathrm{eff}}}.

$$

  

标量 NLSE 中的 Kerr 项为

  

$$

j\gamma |A|^2A.

$$

  

### 6.2 SPM：Self-Phase Modulation，自相位调制

  

单信道中，信号自己的功率调制自己的相位：

  

$$

\phi_{\mathrm{SPM}}(t)

=

\gamma L_{\mathrm{eff}} |A(t)|^2,

$$

  

其中

  

$$

L_{\mathrm{eff}}

=

\frac{1-e^{-\alpha L}}{\alpha}.

$$

  

SPM 的关键特征：

  

- 相位偏移与瞬时功率相关；

- 功率起伏越大，相位调制越强；

- 与色散共同作用时，非线性相位调制会转化为幅度噪声和 ISI；

- 对高阶 QAM 和 PCS-QAM 更敏感，因为星座幅度层级更多、峰均功率和四阶矩可能变化。

  

### 6.3 XPM：Cross-Phase Modulation，交叉相位调制

  

在 WDM 系统中，第 $i$ 个信道不仅受自身功率影响，也受相邻信道功率影响。简化 co-polarized 模型为

  

$$

\frac{\partial A_i}{\partial z}

=

\cdots

+

j\gamma

\left(

|A_i|^2

+

2\sum_{j\ne i}|A_j|^2

\right)

A_i.

$$

  

其中：

  

- $|A_i|^2A_i$ 对应 SPM；

- $2|A_j|^2A_i$ 对应 XPM；

- 系数 2 来自 Kerr 张量在简化偏振条件下的结果；在随机双偏振 Manakov 模型中有效系数会变化。

  

XPM 的物理含义：邻道功率随时间变化，导致本信道相位随时间随机起伏。

  

$$

\phi_{\mathrm{XPM},i}(t)

\approx

2\gamma L_{\mathrm{eff}}

\sum_{j\ne i}|A_j(t)|^2.

$$

  

在强色散链路中，不同 WDM 信道群速度不同，walk-off 会把邻道符号序列的功率起伏“平均化”，但不会完全消失。残差会表现为非线性干扰（nonlinear interference, NLI）。

  

### 6.4 为什么随机 noise 和 XPM 会引入平均非线性

  

把信号写成 $A$，噪声写成 $n$。Kerr 项对总场作用：

  

$$

|A+n|^2(A+n).

$$

  

展开：

  

$$

|A+n|^2(A+n)

=

|A|^2A

+

A^2n^*

+

2|A|^2n

+

2A|n|^2

+

A^*n^2

+

|n|^2n.

$$

  

若 $n$ 是零均值圆对称复高斯噪声，满足

  

$$

\mathbb{E}[n]=0,\qquad

\mathbb{E}[n^2]=0,\qquad

\mathbb{E}[|n|^2]=\sigma_n^2,

$$

  

则对噪声取期望：

  

$$

\mathbb{E}\left[

|A+n|^2(A+n)

\right]

=

|A|^2A+2\sigma_n^2 A.

$$

  

第二项 $2\sigma_n^2 A$ 是噪声功率导致的平均非线性相位偏移。它的残差项则表现为信号-噪声非线性相互作用噪声。

  

类似地，XPM 中邻道功率 $|A_j(t)|^2$ 是随机符号过程。它可以分解为均值和波动：

  

$$

|A_j(t)|^2

=

\mathbb{E}[|A_j|^2]

+

\delta P_j(t).

$$

  

于是 XPM 相位分成

  

$$

\phi_{\mathrm{XPM}}(t)

=

2\gamma L_{\mathrm{eff}}

\sum_{j\ne i}\mathbb{E}[|A_j|^2]

+

2\gamma L_{\mathrm{eff}}

\sum_{j\ne i}\delta P_j(t).

$$

  

第一项是平均非线性相位旋转，可以被 CPE 或静态相位校正部分吸收；第二项是随机非线性相位噪声，会造成不可完全消除的 NLI。

  

### 6.5 GN 模型中的 NLI 直觉

  

GN 模型把强色散、WDM、多跨链路中的非线性干扰近似为加性高斯噪声：

  

$$

Y=X+N_{\mathrm{ASE}}+N_{\mathrm{NLI}}.

$$

  

常用量级关系是

  

$$

\sigma_{\mathrm{NLI}}^2

\approx

\eta P^3,

$$

  

其中 $P$ 是发射功率，$\eta$ 是与光纤参数、色散、信道间隔、符号率、跨数、频谱形状有关的非线性系数。于是总噪声近似为

  

$$

\sigma_{\mathrm{tot}}^2

=

\sigma_{\mathrm{ASE}}^2+\eta P^3.

$$

  

接收 SNR 近似为

  

$$

\mathrm{SNR}(P)

=

\frac{P}{\sigma_{\mathrm{ASE}}^2+\eta P^3}.

$$

  

这解释了长距离系统中存在最优发射功率：功率太低时 ASE 主导，功率太高时非线性主导。

  

---

  

## 7. PCS、Maxwell-Boltzmann 分布与 Mutual Information

  

### 7.1 什么是 PCS

  

PCS（probabilistic constellation shaping）是保持星座点几何位置不变，但改变星座点发送概率的方法。

  

均匀 16QAM 中：

  

$$

P_X(x)=\frac{1}{16}.

$$

  

PCS-16QAM 中，内圈低能量点更常出现，外圈高能量点更少出现：

  

$$

P_X(x)\neq \frac{1}{16}.

$$

  

这样做的目的：

  

1. 降低平均发射能量；

2. 在给定 SNR 下提高可达信息率；

3. 实现细粒度速率自适应；

4. 缩小与 AWGN Shannon capacity 的 shaping gap。

  

### 7.2 Maxwell-Boltzmann 分布

  

PCS 常用 Maxwell-Boltzmann, MB, 分布：

  

$$

P_X(x)

=

\frac{e^{-\nu |x|^2}}

{\sum_{a\in\mathcal{X}} e^{-\nu |a|^2}},

\qquad

\nu\ge 0.

$$

  

其中 $\nu$ 控制 shaping 强度：

  

- $\nu=0$：退化为均匀分布；

- $\nu$ 越大：低能量点概率越高；

- $\nu$ 过大：星座有效熵下降，净速率降低。

  

对方形 QAM，常把二维 QAM 分解成两个独立 PAM 维度。以 16QAM 为例，实部和虚部来自 4-PAM：

  

$$

\mathcal{A}=\{-3,-1,+1,+3\}.

$$

  

若符号符号位正负等概率，幅度 $A\in\{1,3\}$ 可按

  

$$

P_A(a)

=

\frac{e^{-\nu a^2}}

{e^{-\nu 1^2}+e^{-\nu 3^2}},

\qquad a\in\{1,3\}.

$$

  

再组合成 16QAM。

  

### 7.3 Distribution Matching 与 PAS

  

实际系统输入 bit 近似均匀。要产生非均匀星座，需要 distribution matcher, DM：

  

$$

\{0,1\}^{k}

\rightarrow

A^n,

$$

  

使输出幅度序列 $A^n$ 的经验分布接近目标 $P_A$。

  

PAS（probabilistic amplitude shaping）的典型结构是：

  

1. DM 产生非均匀幅度；

2. 系统atic FEC 编码产生校验位；

3. 校验位常用于符号正负号；

4. 接收端进行软解调和 FEC 解码；

5. DM 反匹配恢复原始比特。

  

PCS 的净信息率不再简单等于 $\log_2 M$。如果 $H(X)$ 是星座输入熵，则每符号最多携带

  

$$

H(X)=-\sum_{x\in\mathcal{X}}P_X(x)\log_2 P_X(x)

$$

  

比特信息，而不是 $\log_2 M$。

  

### 7.4 Mutual Information

  

对离散输入连续输出信道，互信息定义为

  

$$

I(X;Y)

=

\sum_{x\in\mathcal{X}}P_X(x)

\int p(y|x)

\log_2

\frac{p(y|x)}

{\sum_{a\in\mathcal{X}}P_X(a)p(y|a)}

dy.

$$

  

等价地，

  

$$

I(X;Y)=H(X)-H(X|Y).

$$

  

在 AWGN 信道中，

  

$$

p(y|x)=\frac{1}{\pi N_0}

\exp\left(-\frac{|y-x|^2}{N_0}\right).

$$

  

若接收端使用符号级 MAP 解调，MI 是自然的可达速率指标。

  

### 7.5 GMI：更贴近 bit-wise FEC 的指标

  

实际相干系统通常使用 bit-interleaved coded modulation, BICM，FEC 解码器接收每个 bit 的 LLR。此时更常用 generalized mutual information, GMI：

  

$$

\mathrm{GMI}

=

\sum_{i=1}^{m} I(B_i;Y),

\qquad m=\log_2 M.

$$

  

对于 PCS，bit 先验不是均匀的，LLR 需要包含先验概率：

  

$$

L_i(y)

=

\log

\frac{

\sum_{x\in\mathcal{X}_{i,0}} P_X(x)p(y|x)

}{

\sum_{x\in\mathcal{X}_{i,1}} P_X(x)p(y|x)

}.

$$

  

如果仍按均匀先验计算 LLR，会损失一部分 shaping gain。

  

常用 normalized GMI 可写成

  

$$

\mathrm{NGMI}

=

1-\frac{H(X)-\mathrm{GMI}}{m}.

$$

  

不同论文对 NGMI/ASI 的定义略有差异，比较实验结果时必须核对定义。

  

### 7.6 为什么用 MI 描述 PCS-16QAM

  

BER 对 PCS-16QAM 不够充分，原因是：

  

1. **输入分布变了**：错误发生在高概率点和低概率点，对信息率影响不同；

2. **FEC 看的是软信息**：相同 BER 下，LLR 分布可能不同；

3. **PCS 改变熵**：PCS-16QAM 的每符号信息量是 $H(X)$，不是固定 4 bit/symbol；

4. **PCS 的目标是接近容量**：容量和可达速率天然由互信息描述；

5. **非线性光纤中 BER 不一定预测 post-FEC 性能**：GMI/NGMI 常与软判决 FEC 门限更一致。

  

因此，描述 PCS-16QAM 时应报告：

  

- input entropy $H(X)$；

- MI 或 GMI；

- NGMI；

- pre-FEC BER；

- post-FEC BER 或 FEC threshold；

- OSNR/SNR；

- shaping 参数 $\nu$ 和目标 PMF。

  

---

  

## 8. 数值仿真中的 PRNG 算法族

  

你列出的算法都是伪随机数生成器（pseudo-random number generator, PRNG）或 PRNG 家族。它们用于生成：

  

- PRBS/随机 bit；

- QAM 符号；

- ASE 噪声；

- 激光相位噪声；

- PMD 随机过程；

- Monte Carlo 多次独立实验；

- 数据增强或 DT 模型训练数据。

  

PRNG 不是“真随机”，而是由 seed 确定的可复现序列：

  

$$

u_0,u_1,u_2,\ldots \in [0,1).

$$

  

好的通信仿真要求 PRNG 具备：

  

1. 长周期；

2. 好的高维均匀性；

3. 可复现；

4. 可并行独立 stream；

5. 统计测试表现好；

6. 不在调制、交织、FEC、Monte Carlo 结构中产生隐藏相关性。

  

### 8.1 梅森旋转算法：Mersenne Twister

  

中文通常译为“梅森扭转算法”，不是“梅森旋转算法”。其代表版本是 MT19937，周期为

  

$$

2^{19937}-1.

$$

  

Mersenne Twister 是一种 $\mathbb{F}_2$ 线性递推生成器，强调高维均匀分布性质。其状态很大，经典 MT19937 不是密码学安全的，也不天然适合大规模 GPU 并行多 stream，除非额外设计 stream splitting 或 jump-ahead。

  

适用场景：

  

- 单机 CPU Monte Carlo；

- 可复现实验；

- 一般噪声与符号生成。

  

不适合：

  

- 密码学；

- 对并行 stream 独立性要求很高但未做 stream 管理的 GPU 仿真。

  

### 8.2 组合多重递归算法：Combined Multiple Recursive Generator, CMRG

  

单个 multiple recursive generator, MRG, 可写成

  

$$

x_n=

(a_1x_{n-1}+a_2x_{n-2}+\cdots+a_kx_{n-k})\bmod m.

$$

  

CMRG 把多个 MRG 输出组合，例如

  

$$

z_n=(x_n-y_n)\bmod m.

$$

  

组合的目的：

  

- 增大周期；

- 改善格结构；

- 支持多 stream；

- 比简单 LCG 更稳健。

  

L'Ecuyer 的 MRG32k3a 是经典 CMRG，广泛用于仿真系统，因为它支持 stream/substream 划分，适合并行 Monte Carlo。

  

### 8.3 乘法滞后斐波那契算法：Multiplicative Lagged Fibonacci Generator, MLFG

  

滞后斐波那契生成器一般形式为

  

$$

x_n=(x_{n-j}\star x_{n-k})\bmod m,

\qquad 0<j<k,

$$

  

其中 $\star$ 可以是加法、减法、乘法或 XOR。若 $\star$ 是乘法，则为 MLFG：

  

$$

x_n=(x_{n-j}x_{n-k})\bmod m.

$$

  

其特点：

  

- 需要保存 $k$ 个历史状态；

- 速度快；

- 周期可很长；

- 对初始化和参数选择敏感；

- 某些低阶相关性可能影响高精度 Monte Carlo。

  

通信仿真中若使用 MLFG，应明确：

  

- lags $(j,k)$；

- modulus $m$；

- seed 初始化方法；

- stream 划分方式；

- 是否通过 TestU01/Dieharder 等统计测试。

  

### 8.4 Philox 4×32 生成器（10 轮）

  

Philox 是 counter-based PRNG。它不是用递推状态

  

$$

x_{n+1}=F(x_n),

$$

  

而是把 counter 和 key 输入一个双射变换：

  

$$

\mathbf{u}_n=F_{\mathrm{key}}(\mathbf{c}_n).

$$

  

其中 $\mathbf{c}_n$ 是计数器。Philox 4×32-10 表示：

  

- 输出/内部 counter 由 4 个 32-bit word 组成；

- 使用 10 轮 round；

- round 函数基于乘法、异或和置换。

  

Counter-based PRNG 的优势是天然并行：

  

$$

u_n=F_{\mathrm{key}}(n)

$$

  

可以直接随机访问第 $n$ 个随机数，不需要从 $0$ 递推到 $n$。这对 GPU、大规模并行 Monte Carlo、批量生成 ASE 噪声非常有用。

  

### 8.5 Threefry 4×64 生成器（20 轮）

  

Threefry 也是 Random123 家族中的 counter-based PRNG，设计灵感来自 Threefish 分组密码。Threefry 4×64-20 表示：

  

- counter/output 为 4 个 64-bit word；

- 使用 20 轮混合；

- round 操作主要由加法、旋转、异或组成，即 ARX: add-rotate-xor。

  

相比 Philox：

  

- Threefry 更偏向 ARX 混合；

- Philox 更依赖乘法混合；

- 两者都适合并行和可复现随机访问；

- 具体性能依赖 CPU/GPU 架构。

  

### 8.6 在光通信仿真中如何选 PRNG

  

建议：

  

1. 单线程 Python/Numpy 原型：PCG64 或 MT19937 足够；

2. 多 stream Monte Carlo：CMRG/MRG32k3a 或 counter-based；

3. GPU 并行：Philox/Threefry 更合适；

4. 要复现实验：固定 seed、记录 PRNG 类型和版本；

5. 要生成多个随机源：为 bit、ASE、phase noise、PMD 使用不同 key/stream，避免相关性；

6. 论文中应报告：PRNG 名称、seed、stream 划分、是否独立重复实验。

  

---

  

## 9. EEPN 与 Cycle Slip：如何理解原文那段话

  

原文：

  

> 均衡增强相位噪声 (EEPN) 源于相干光学系统中本振激光相位噪声与色散均衡器之间的相互作用。在我们的系统中，EEPN 效应并不显著，因此我们没有将其纳入 DT 模型中。然而，鉴于其随机特性 36, 37，我们可以利用生成对抗网络 (GAN) 来模拟这种缺陷。此外，由于估计载波相位发生显著的突变，CPE 中会出现周跳，导致相位跟踪环路失去锁定。这种现象会严重影响 DSP 和 DT 模型的性能。为了缓解这个问题，DSP 采用导频辅助 CPE 来降低周跳的影响。

  

可以分成两部分理解。

  

### 9.1 EEPN 是什么

  

CDC 是一个色散逆滤波器，具有强烈的频率相关相位响应：

  

$$

H_{\mathrm{CDC}}(\Omega)=H_{\mathrm{CD}}^{-1}(\Omega).

$$

  

LO 相位噪声在相干混频时乘到接收信号上：

  

$$

r(t)=s_{\mathrm{CD}}(t)e^{j\phi_{\mathrm{LO}}(t)}.

$$

  

如果没有 CDC，LO 相位噪声主要表现为公共相位旋转。

但 CDC 是一个长记忆滤波器，而相位噪声是时变乘法项。一般有

  

$$

H_{\mathrm{CDC}}\{s_{\mathrm{CD}}(t)e^{j\phi_{\mathrm{LO}}(t)}\}

\ne

e^{j\phi_{\mathrm{LO}}(t)}

H_{\mathrm{CDC}}\{s_{\mathrm{CD}}(t)\}.

$$

  

也就是说：**时变相位噪声和色散均衡滤波器不交换**。CDC 会把 LO 相位噪声的一部分转化为额外的幅度/相位扰动，这就是 EEPN。

  

常用量级估计为

  

$$

\sigma_{\mathrm{EEPN}}^2

\propto

\frac{\lambda^2}{c}

\frac{D L\,\Delta\nu_{\mathrm{LO}}}{T_s},

$$

  

即 EEPN 随以下因素增大：

  

- 累积色散 $DL$；

- LO 线宽 $\Delta\nu_{\mathrm{LO}}$；

- 符号率 $R_s=1/T_s$；

- 电子色散补偿强度。

  

这也解释了为什么 EEPN 在高波特率、长距离、大色散、低成本宽线宽 LO 的系统中更显著。

  

### 9.2 “我们系统中 EEPN 不显著，因此未纳入 DT 模型”是什么意思

  

DT 指 digital twin 或数字孪生模型。建模时不可能把所有物理缺陷都纳入，否则模型复杂度过高、参数不可辨识。若系统中：

  

- 链路色散不大；

- LO 线宽较窄；

- 波特率不高；

- CPE 可吸收大部分残余；

- 实测 BER/GMI 对 EEPN 不敏感；

  

则可以把 EEPN 排除在 DT 模型之外，把它视作二阶小量。

  

这不是说 EEPN 不存在，而是说它对当前系统观测指标的贡献低于建模分辨率或实验噪声地板。

  

### 9.3 “可用 GAN 模拟 EEPN 这种随机缺陷”是什么意思

  

EEPN 是随机过程，不只是一个固定滤波器。若要把它纳入 DT，有两种路线：

  

**物理模型路线：**

  

1. 生成 LO 相位噪声 $\phi_{\mathrm{LO}}(t)$；

2. 经过含 CD 的光纤传播；

3. 在接收端做 CDC；

4. 得到 EEPN 残差统计。

  

**数据驱动路线：**

  

用 GAN 学习 EEPN 残差分布：

  

$$

\mathbf{e}_{\mathrm{EEPN}}

=

G(\mathbf{z};\mathbf{c}),

$$

  

其中 $\mathbf{z}$ 是随机噪声输入，$\mathbf{c}$ 是条件变量，例如：

  

$$

\mathbf{c}=

(DL,\Delta\nu_{\mathrm{LO}},R_s,\mathrm{OSNR},P_{\mathrm{launch}}).

$$

  

但使用 GAN 有风险。必须验证生成缺陷是否匹配真实 EEPN 的：

  

- 相位噪声 PSD；

- 自相关函数；

- 幅相耦合统计；

- BER/GMI penalty；

- 与 CDC/CPE 的交互；

- 不同 OSNR、色散、线宽条件下的外推能力。

  

否则 GAN 可能只是生成“看起来像噪声”的扰动，而不是物理上正确的 EEPN。

  

### 9.4 Cycle Slip 是什么

  

CPE 通常只能估计相位到某个模糊周期。以 QPSK 为例，星座旋转 $\pi/2$ 后仍与自身重合。因此相位估计存在

  

$$

\hat{\phi}_k

\equiv

\phi_k

\pmod{\frac{2\pi}{M_{\mathrm{sym}}}},

$$

  

对于 QPSK 是 $\pi/2$ 模糊；对方形 QAM 也常存在 $\pi/2$ rotational ambiguity。

  

当相位噪声、ASE 或非线性扰动较强时，CPE 可能把相位轨迹错误地跳到相邻模糊分支：

  

$$

\hat{\phi}_k

\rightarrow

\hat{\phi}_k+\frac{2\pi}{q},

$$

  

其中 $q$ 是星座旋转对称阶数。这个突然跳变就是 cycle slip。

  

Cycle slip 的后果很严重：

  

- 后续符号整体被错误旋转；

- 短时间内产生 burst errors；

- DD-LMS 可能错误更新；

- FEC 可能无法纠正；

- DT 模型若没有建模该突变，会出现预测崩溃。

  

### 9.5 为什么导频辅助 CPE 可以缓解 cycle slip

  

导频符号相位已知，可提供绝对相位参考。假设每隔 $L_p$ 个符号插入导频，导频位置为 $k_m$。接收导频相位估计为

  

$$

\hat{\phi}_{k_m}

=

\arg(y_{k_m}p_{k_m}^*).

$$

  

若某段 CPE 估计发生了 $\pi/2$ 或 $\pi$ 跳变，与导频相位对比就能检测到：

  

$$

\Delta_m

=

\mathrm{unwrap}

\left(

\hat{\phi}_{k_m}^{\mathrm{blind}}

-

\hat{\phi}_{k_m}^{\mathrm{pilot}}

\right).

$$

  

当 $\Delta_m$ 接近星座模糊周期时，即可修正对应数据块相位。

因此导频辅助 CPE 的作用是：

  

1. 提供相位锚点；

2. 辅助相位 unwrap；

3. 降低盲 CPE 的分支选择错误；

4. 减少 cycle slip 造成的 burst errors；

5. 提高 DSP 和 DT 输出稳定性。

  

代价是导频开销：

  

$$

R_{\mathrm{net}}

\approx

R_{\mathrm{gross}}

\left(1-\frac{1}{L_p}\right)

$$

  

以及额外 DSP 复杂度。

  

---

  

## 10. 建模与仿真建议

  

### 10.1 最小可复现相干链路模型

  

建议按以下顺序构建：

  

1. PRNG 固定 seed，生成 bit；

2. QAM/PCS-QAM 映射；

3. RRC pulse shaping；

4. resampling 到 DAC rate；

5. Tx 带宽/IQ skew 模型；

6. 光纤线性 CD；

7. ASE noise；

8. Kerr 非线性，可先用 SSFM；

9. coherent receiver + ADC；

10. resampling / timing recovery；

11. CDC；

12. 2×2 MIMO equalizer；

13. FOE；

14. CPE；

15. demapper；

16. BER/EVM/MI/GMI/NGMI 统计。

  

### 10.2 哪些损伤适合物理建模，哪些适合数据驱动

  

| 损伤 | 优先模型 | 原因 |

|---|---|---|

| CD | 物理模型 | 确定性线性滤波，参数明确 |

| PMD | 物理 + 随机过程 | Jones 矩阵/DGD 可建模，但时变随机 |

| PN | Wiener 过程 + CPE | 物理统计清晰 |

| ASE | AWGN/放大器噪声模型 | 统计清晰 |

| SPM/XPM | SSFM/GN/EGN | 物理机制明确但复杂 |

| Tx bandwidth | 测量响应 + 逆滤波 | 可标定 |

| I/Q skew | 延迟模型 | 可标定 |

| EEPN | 条件物理模型；必要时数据驱动 | 与 DSP 交互强 |

| Cycle slip | 事件模型 + 导频检测 | 稀有突发事件，不能只用均值噪声描述 |

  

### 10.3 写论文或报告时的关键检查项

  

如果你要解释“某损伤未纳入 DT 模型”，应给出至少一种证据：

  

1. 消融实验：加入/不加入该损伤，BER/GMI 差异低于阈值；

2. 量级估计：理论方差小于主导噪声项；

3. 参数范围：当前 $DL,\Delta\nu,R_s$ 不足以激发该损伤；

4. DSP 吸收：CPE/均衡器能稳定补偿；

5. 实测验证：残差统计中没有该损伤的可辨识特征。

  

如果只写“not significant”，审稿人可能会要求定量依据。

  

---

  

## 11. 参考文献

  

### 相干接收机 DSP 与系统综述

  

1. Savory, S. J. (2010). **Digital Coherent Optical Receivers: Algorithms and Subsystems**. *IEEE Journal of Selected Topics in Quantum Electronics*, 16(5), 1164–1179. DOI: `10.1109/JSTQE.2010.2044751`.

2. Faruk, M. S., & Savory, S. J. (2017). **Digital Signal Processing for Coherent Transceivers Employing Multilevel Formats**. *Journal of Lightwave Technology*, 35(5), 1125–1141.

3. Kikuchi, K. (2016). **Fundamentals of Coherent Optical Fiber Communications**. *Journal of Lightwave Technology*, 34(1), 157–179.

  

### Pulse shaping、Nyquist 条件与数字通信

  

4. Nyquist, H. (1928). **Certain Topics in Telegraph Transmission Theory**. *Transactions of the AIEE*, 47(2), 617–644. DOI: `10.1109/T-AIEE.1928.5055024`.

5. Proakis, J. G., & Salehi, M. (2008). **Digital Communications**. 5th ed. McGraw-Hill.

  

### 光纤物理、非线性与 GN 模型

  

6. Agrawal, G. P. (2010). **Fiber-Optic Communication Systems**. 4th ed. Wiley.

7. Agrawal, G. P. (2019). **Nonlinear Fiber Optics**. 6th ed. Academic Press.

8. Poggiolini, P. (2012). **The GN Model of Non-Linear Propagation in Uncompensated Coherent Optical Systems**. *Journal of Lightwave Technology*, 30(24), 3857–3879. DOI: `10.1109/JLT.2012.2217729`.

9. Johannisson, P., & Karlsson, M. (2013). **Perturbation Analysis of Nonlinear Propagation in a Strongly Dispersive Optical Communication System**. *Journal of Lightwave Technology*, 31(8), 1273–1282.

  

### CPE、FOE 与 phase recovery

  

10. Viterbi, A. J., & Viterbi, A. M. (1983). **Nonlinear Estimation of PSK-Modulated Carrier Phase with Application to Burst Digital Transmission**. *IEEE Transactions on Information Theory*, 29(4), 543–551. DOI: `10.1109/TIT.1983.1056713`.

11. Pfau, T., Hoffmann, S., & Noé, R. (2009). **Hardware-Efficient Coherent Digital Receiver Concept With Feedforward Carrier Recovery for M-QAM Constellations**. *Journal of Lightwave Technology*, 27(8), 989–999. DOI: `10.1109/JLT.2008.2010511`.

  

### PCS、PAS、MI/GMI

  

12. Böcherer, G., Steiner, F., & Schulte, P. (2015). **Bandwidth Efficient and Rate-Matched Low-Density Parity-Check Coded Modulation**. *IEEE Transactions on Communications*, 63(12), 4651–4665. DOI: `10.1109/TCOMM.2015.2494016`.

13. Schulte, P., & Böcherer, G. (2016). **Constant Composition Distribution Matching**. *IEEE Transactions on Information Theory*, 62(1), 430–434. DOI: `10.1109/TIT.2015.2499181`.

14. Buchali, F., Steiner, F., Böcherer, G., Schmalen, L., Schulte, P., & Idler, W. (2016). **Rate Adaptation and Reach Increase by Probabilistically Shaped 64-QAM: An Experimental Demonstration**. *Journal of Lightwave Technology*, 34(7), 1599–1609. DOI: `10.1109/JLT.2015.2510034`.

15. Cho, J., & Winzer, P. J. (2019). **Probabilistic Constellation Shaping for Optical Fiber Communications**. *Journal of Lightwave Technology*, 37(6), 1590–1607. DOI: `10.1109/JLT.2019.2898855`.

  

### EEPN 与 cycle slip

  

16. Shieh, W., & Ho, K.-P. (2008). **Equalization-enhanced phase noise for coherent-detection systems using electronic digital signal processing**. *Optics Express*, 16(20), 15718–15727. DOI: `10.1364/OE.16.015718`.

17. Arnould, A., & Ghazisaeidi, A. (2020). **Equalization Enhanced Phase Noise in Coherent Receivers: DSP-Aware Analysis and Shaped Constellations**. *Journal of Lightwave Technology*, 38(4), 791–800.

18. Magarini, M., Spalvieri, A., & Barletta, L. (2012). **Pilot-Symbols Aided Carrier Phase Recovery for 100G PM-QPSK Digital Coherent Receivers**. *IEEE Photonics Technology Letters*, 24(9), 739–741.

19. Cheng, H., et al. (2013). **Pilot-symbols-aided cycle slip mitigation for DP-16QAM coherent optical communication systems**. *Optics Express*, 21(19), 22166–22174.

  

### PRNG

  

20. Matsumoto, M., & Nishimura, T. (1998). **Mersenne Twister: A 623-dimensionally equidistributed uniform pseudo-random number generator**. *ACM Transactions on Modeling and Computer Simulation*, 8(1), 3–30. DOI: `10.1145/272991.272995`.

21. L'Ecuyer, P. (1999). **Good Parameters and Implementations for Combined Multiple Recursive Random Number Generators**. *Operations Research*, 47(1), 159–164. DOI: `10.1287/opre.47.1.159`.

22. Salmon, J. K., Moraes, M. A., Dror, R. O., & Shaw, D. E. (2011). **Parallel Random Numbers: As Easy as 1, 2, 3**. *SC11: International Conference for High Performance Computing, Networking, Storage and Analysis*. DOI: `10.1145/2063384.2063405`.

23. Knuth, D. E. (1997). **The Art of Computer Programming, Volume 2: Seminumerical Algorithms**. 3rd ed. Addison-Wesley.

  

### OSNR/Q-factor 标准与工程参考

  

24. ITU-T. (2016). **G.697: Optical monitoring for dense wavelength division multiplexing systems**.

25. ITU-T. (2003). **O.201: Q-factor test equipment to estimate the transmission performance of optical channels**.

  

---

  

## 速记版：核心关系

  

```text

Q factor:

Q = (mu1 - mu0)/(sigma1 + sigma0)

BER ≈ 0.5 erfc(Q/sqrt(2))

  

CD:

H_CD(Ω) = exp(j β2 L Ω²/2)

H_CDC = H_CD^{-1}

  

PMD:

y[n] = Σ H_l x[n-l] + v[n]

MIMO equalizer learns W ≈ H^{-1}

  

FOE:

phase slope = 2π Δf k Ts

compensate by exp(-j 2π Δf_hat k Ts)

  

CPE:

phase noise Wiener process

phi_k = phi_{k-1} + Δphi_k

  

SPM:

phi_SPM = γ L_eff |A(t)|²

  

XPM:

phi_XPM ≈ 2 γ L_eff Σ neighboring powers

  

PCS:

P_X(x) ∝ exp(-ν |x|²)

use MI/GMI because input distribution is nonuniform

  

EEPN:

LO phase noise and CDC do not commute

stronger when D L, LO linewidth, symbol rate increase

  

Cycle slip:

CPE estimate jumps by rotational ambiguity period

pilot-aided CPE provides phase anchors

```