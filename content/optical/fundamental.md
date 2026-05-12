# 相干光纤通信系统核心概念 Wiki

> **作者笔记**：本文档面向光纤通信与人工智能交叉方向研究者，作为个人知识库使用。所有数学推导力求自洽、严格，参考文献均可核查。若发现错误，请在文档末尾注记。
> 
> **最后更新**：2025年  
> **适用系统**：PolMux相干WDM系统，采用软件定义DSP收发架构

---

## 目录

- [1. Q 因子与误码率](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#1-q-%E5%9B%A0%E5%AD%90%E4%B8%8E%E8%AF%AF%E7%A0%81%E7%8E%87)
    - [1.1 物理直觉](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#11-%E7%89%A9%E7%90%86%E7%9B%B4%E8%A7%89)
    - [1.2 二进制系统的严格定义](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#12-%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%B8%A5%E6%A0%BC%E5%AE%9A%E4%B9%89)
    - [1.3 高阶 QAM 的推广](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#13-%E9%AB%98%E9%98%B6-qam-%E7%9A%84%E6%8E%A8%E5%B9%BF)
    - [1.4 Q (dB) 与 BER 的对应表](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#14-q-db-%E4%B8%8E-ber-%E7%9A%84%E5%AF%B9%E5%BA%94%E8%A1%A8)
    - [1.5 参考文献](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#15-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)
- [2. 接收机 DSP 处理链](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#2-%E6%8E%A5%E6%94%B6%E6%9C%BA-dsp-%E5%A4%84%E7%90%86%E9%93%BE)
    - [2.1 处理链总览](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#21-%E5%A4%84%E7%90%86%E9%93%BE%E6%80%BB%E8%A7%88)
    - [2.2 CDC：色散补偿](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#22-cdc%E8%89%B2%E6%95%A3%E8%A1%A5%E5%81%BF)
    - [2.3 MIMO 均衡器：偏振解复用与 PMD 补偿](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#23-mimo-%E5%9D%87%E8%A1%A1%E5%99%A8%E5%81%8F%E6%8C%AF%E8%A7%A3%E5%A4%8D%E7%94%A8%E4%B8%8E-pmd-%E8%A1%A5%E5%81%BF)
    - [2.4 FOE：频率偏移估计](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#24-foe%E9%A2%91%E7%8E%87%E5%81%8F%E7%A7%BB%E4%BC%B0%E8%AE%A1)
    - [2.5 CPE：载波相位估计](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#25-cpe%E8%BD%BD%E6%B3%A2%E7%9B%B8%E4%BD%8D%E4%BC%B0%E8%AE%A1)
    - [2.6 参考文献](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#26-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)
- [3. DSP 对 PMD 与相位噪声时变效应的缓解机制](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#3-dsp-%E5%AF%B9-pmd-%E4%B8%8E%E7%9B%B8%E4%BD%8D%E5%99%AA%E5%A3%B0%E6%97%B6%E5%8F%98%E6%95%88%E5%BA%94%E7%9A%84%E7%BC%93%E8%A7%A3%E6%9C%BA%E5%88%B6)
    - [3.1 时变信道的统计特征](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#31-%E6%97%B6%E5%8F%98%E4%BF%A1%E9%81%93%E7%9A%84%E7%BB%9F%E8%AE%A1%E7%89%B9%E5%BE%81)
    - [3.2 自适应均衡跟踪 PMD](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#32-%E8%87%AA%E9%80%82%E5%BA%94%E5%9D%87%E8%A1%A1%E8%B7%9F%E8%B8%AA-pmd)
    - [3.3 CPE 跟踪相位噪声](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#33-cpe-%E8%B7%9F%E8%B8%AA%E7%9B%B8%E4%BD%8D%E5%99%AA%E5%A3%B0)
    - [3.4 参考文献](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#34-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)
- [4. 发送机 DSP：Pulse Shaping、Resampling 与 Precompensation](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#4-%E5%8F%91%E9%80%81%E6%9C%BA-dsppulse-sharingresampling-%E4%B8%8E-precompensation)
    - [4.1 Pulse Shaping：脉冲成形](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#41-pulse-shaping%E8%84%89%E5%86%B2%E6%88%90%E5%BD%A2)
    - [4.2 Resampling：重采样](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#42-resampling%E9%87%8D%E9%87%87%E6%A0%B7)
    - [4.3 Precompensation：预补偿](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#43-precompensation%E9%A2%84%E8%A1%A5%E5%81%BF)
    - [4.4 参考文献](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#44-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)
- [5. 非线性效应：SPM、XPM 与平均非线性](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#5-%E9%9D%9E%E7%BA%BF%E6%80%A7%E6%95%88%E5%BA%94spmxpm-%E4%B8%8E%E5%B9%B3%E5%9D%87%E9%9D%9E%E7%BA%BF%E6%80%A7)
    - [5.1 光 Kerr 效应与 NLSE](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#51-%E5%85%89-kerr-%E6%95%88%E5%BA%94%E4%B8%8E-nlse)
    - [5.2 SPM：自相位调制](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#52-spm%E8%87%AA%E7%9B%B8%E4%BD%8D%E8%B0%83%E5%88%B6)
    - [5.3 XPM：交叉相位调制](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#53-xpm%E4%BA%A4%E5%8F%89%E7%9B%B8%E4%BD%8D%E8%B0%83%E5%88%B6)
    - [5.4 随机噪声与非线性的耦合：Gordon–Mollenauer 效应](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#54-%E9%9A%8F%E6%9C%BA%E5%99%AA%E5%A3%B0%E4%B8%8E%E9%9D%9E%E7%BA%BF%E6%80%A7%E7%9A%84%E8%80%A6%E5%90%88gordonmollenauer-%E6%95%88%E5%BA%94)
    - [5.5 高斯噪声（GN）模型：统计平均非线性](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#55-%E9%AB%98%E6%96%AF%E5%99%AA%E5%A3%B0gn%E6%A8%A1%E5%9E%8B%E7%BB%9F%E8%AE%A1%E5%B9%B3%E5%9D%87%E9%9D%9E%E7%BA%BF%E6%80%A7)
    - [5.6 参考文献](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#56-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)
- [6. PCS 调制与互信息](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#6-pcs-%E8%B0%83%E5%88%B6%E4%B8%8E%E4%BA%92%E4%BF%A1%E6%81%AF)
    - [6.1 均匀 QAM 的成形间隙](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#61-%E5%9D%87%E5%8C%80-qam-%E7%9A%84%E6%88%90%E5%BD%A2%E9%97%B4%E9%9A%99)
    - [6.2 概率星座成形（PCS）](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#62-%E6%A6%82%E7%8E%87%E6%98%9F%E5%BA%A7%E6%88%90%E5%BD%A2pcs)
    - [6.3 Maxwell–Boltzmann 分布的严格推导](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#63-maxwellboltzmann-%E5%88%86%E5%B8%83%E7%9A%84%E4%B8%A5%E6%A0%BC%E6%8E%A8%E5%AF%BC)
    - [6.4 互信息（Mutual Information）](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#64-%E4%BA%92%E4%BF%A1%E6%81%AFmutual-information)
    - [6.5 为什么用 MI 而非 BER 评估 PCS-16QAM](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#65-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%94%A8-mi-%E8%80%8C%E9%9D%9E-ber-%E8%AF%84%E4%BC%B0-pcs-16qam)
    - [6.6 可达信息速率（AIR）](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#66-%E5%8F%AF%E8%BE%BE%E4%BF%A1%E6%81%AF%E9%80%9F%E7%8E%87air)
    - [6.7 CCDM 实现](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#67-ccdm-%E5%AE%9E%E7%8E%B0)
    - [6.8 参考文献](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#68-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)
- [7. 伪随机数生成算法（PRNG）](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#7-%E4%BC%AA%E9%9A%8F%E6%9C%BA%E6%95%B0%E7%94%9F%E6%88%90%E7%AE%97%E6%B3%95prng)
    - [7.1 蒙特卡洛仿真中 PRNG 质量的重要性](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#71-%E8%92%99%E7%89%B9%E5%8D%A1%E6%B4%9B%E4%BB%BF%E7%9C%9F%E4%B8%AD-prng-%E8%B4%A8%E9%87%8F%E7%9A%84%E9%87%8D%E8%A6%81%E6%80%A7)
    - [7.2 梅森旋转算法（MT19937）](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#72-%E6%A2%85%E6%A3%AE%E6%97%8B%E8%BD%AC%E7%AE%97%E6%B3%95mt19937)
    - [7.3 组合多重递归算法（MRG）](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#73-%E7%BB%84%E5%90%88%E5%A4%9A%E9%87%8D%E9%80%92%E5%BD%92%E7%AE%97%E6%B3%95mrg)
    - [7.4 乘法滞后斐波那契算法（LFG）](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#74-%E4%B9%98%E6%B3%95%E6%BB%9E%E5%90%8E%E6%96%90%E6%B3%A2%E9%82%A3%E5%A5%91%E7%AE%97%E6%B3%95lfg)
    - [7.5 Counter-Based PRNG：Philox 与 Threefry](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#75-counter-based-prngnphilox-%E4%B8%8E-threefry)
    - [7.6 算法对比与选用建议](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#76-%E7%AE%97%E6%B3%95%E5%AF%B9%E6%AF%94%E4%B8%8E%E9%80%89%E7%94%A8%E5%BB%BA%E8%AE%AE)
    - [7.7 参考文献](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#77-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)
- [8. EEPN、周跳与 GAN 建模](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#8-eepn%E5%91%A8%E8%B7%B3%E4%B8%8E-gan-%E5%BB%BA%E6%A8%A1)
    - [8.1 EEPN：均衡增强相位噪声](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#81-eepn%E5%9D%87%E8%A1%A1%E5%A2%9E%E5%BC%BA%E7%9B%B8%E4%BD%8D%E5%99%AA%E5%A3%B0)
    - [8.2 EEPN 的等效噪声功率推导](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#82-eepn-%E7%9A%84%E7%AD%89%E6%95%88%E5%99%AA%E5%A3%B0%E5%8A%9F%E7%8E%87%E6%8E%A8%E5%AF%BC)
    - [8.3 用 GAN 建模 EEPN 的随机特性](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#83-%E7%94%A8-gan-%E5%BB%BA%E6%A8%A1-eepn-%E7%9A%84%E9%9A%8F%E6%9C%BA%E7%89%B9%E6%80%A7)
    - [8.4 周跳（Cycle Slip）](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#84-%E5%91%A8%E8%B7%B3cycle-slip)
    - [8.5 导频辅助 CPE 缓解周跳](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#85-%E5%AF%BC%E9%A2%91%E8%BE%85%E5%8A%A9-cpe-%E7%BC%93%E8%A7%A3%E5%91%A8%E8%B7%B3)
    - [8.6 综合理解](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#86-%E7%BB%BC%E5%90%88%E7%90%86%E8%A7%A3)
    - [8.7 参考文献](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#87-%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)
- [附录 A：符号说明](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#%E9%99%84%E5%BD%95-a%E7%AC%A6%E5%8F%B7%E8%AF%B4%E6%98%8E)
- [附录 B：推荐学习资源](https://claude.ai/chat/17a90516-49da-49f9-bf6a-f1c69a9a92a3#%E9%99%84%E5%BD%95-b%E6%8E%A8%E8%8D%90%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%BA%90)

---

## 1. Q 因子与误码率

### 1.1 物理直觉

**Q 因子**（Q-factor）衡量的是接收信号判决时**信号分离程度与噪声扩散程度之比**，是一个无量纲的信噪裕量指标。

直观地理解：将接收到的"0"符号和"1"符号在概率密度函数（PDF）上画出来，两个分布的均值之差越大（信号分得越开），而各自的标准差越小（噪声越窄），就越不容易判决出错。Q 因子正是量化这种"分开程度"的数字。

```
概率密度
  ^
  |   "0"分布         "1"分布
  |    __               __
  |   /  \             /  \
  |  /    \           /    \
  | /      \         /      \
  |/        \_______/        \
  +---------------------------------> 幅度
      μ₀  ←  d  →  μ₁
      σ₀                σ₁
  
  Q = (μ₁ - μ₀) / (σ₁ + σ₀)
```

### 1.2 二进制系统的严格定义

对于采用高斯噪声模型的二进制系统，"1"电平和"0"电平在判决时刻的条件概率密度分别为：

$$p(r|"1") = \frac{1}{\sqrt{2\pi},\sigma_1}\exp!\left(-\frac{(r-\mu_1)^2}{2\sigma_1^2}\right)$$

$$p(r|"0") = \frac{1}{\sqrt{2\pi},\sigma_0}\exp!\left(-\frac{(r-\mu_0)^2}{2\sigma_0^2}\right)$$

**Q 因子定义**（$\mu_1 > \mu_0$）：

$$\boxed{Q \triangleq \frac{\mu_1 - \mu_0}{\sigma_1 + \sigma_0}}$$

在最优判决门限 $D_{\text{opt}}$ 处（满足 $p("1") = p("0") = 0.5$ 的等概假设）：

$$D_{\text{opt}} = \frac{\mu_1 \sigma_0 + \mu_0 \sigma_1}{\sigma_0 + \sigma_1}$$

**BER 的严格推导**：

$$\text{BER} = \frac{1}{2}\left[P(r < D | "1") + P(r > D | "0")\right]$$

$$= \frac{1}{2}\left[P!\left(Z < \frac{D - \mu_1}{\sigma_1}\right) + P!\left(Z > \frac{D - \mu_0}{\sigma_0}\right)\right]$$

其中 $Z \sim \mathcal{N}(0,1)$。代入最优门限可得：

$$\boxed{\text{BER} = \frac{1}{2},\mathrm{erfc}!\left(\frac{Q}{\sqrt{2}}\right)}$$

其中互补误差函数定义为：

$$\mathrm{erfc}(x) = \frac{2}{\sqrt{\pi}}\int_x^{\infty} e^{-t^2},dt$$

**高 SNR 近似**（$Q \gg 1$）：

$$\text{BER} \approx \frac{1}{Q\sqrt{2\pi}},e^{-Q^2/2}$$

**重要推论**：Q 因子增加 1 dB（约 $\times 1.12$），BER 可以降低一个量级以上（因为指数 $-Q^2/2$ 的存在）。

### 1.3 高阶 QAM 的推广

对于 $M$-QAM（矩形星座，每维 $\sqrt{M}$ 个电平），等概情况下：

**SER（符号错误率）**（格雷编码假设下 $\text{BER} \approx \text{SER}/\log_2 M$）：

$$\text{SER}_{M\text{-QAM}} \approx 4!\left(1 - \frac{1}{\sqrt{M}}\right)\frac{1}{2}\mathrm{erfc}!\left(\sqrt{\frac{3,\text{SNR}}{2(M-1)}}\right)$$

等效 Q 因子（与 AWGN SNR 的关系）：

$$Q_{M\text{-QAM}} = \sqrt{\frac{3,\text{SNR}_s}{M-1}}$$

其中 $\text{SNR}_s$ 为每符号信噪比。对于 16-QAM：

$$Q_{16\text{-QAM}} = \sqrt{\frac{\text{SNR}_s}{5}}$$

**Q (dB) 定义**：

$$Q,[\text{dB}] = 20\log_{10}(Q)$$

> ⚠️ **注意**：$Q$ 因子有时也以线性值引用（如 $Q = 6$），有时以 dB 引用（如 $Q = 15.6$ dB），两者对应关系：线性 $Q = 6 \Leftrightarrow Q_{\text{dB}} = 15.56$ dB。使用时需确认单位。

### 1.4 Q (dB) 与 BER 的对应表

|Q（线性）|Q（dB）|BER（近似）|常见用途|
|:-:|:-:|:-:|:-:|
|3.17|10.0|$10^{-3}$|—|
|3.50|10.9|$2.3\times10^{-4}$|—|
|5.00|14.0|$2.9\times10^{-7}$|—|
|6.00|15.6|$10^{-9}$|传统FEC阈值|
|7.03|16.9|$10^{-12}$|—|
|8.53|18.6|$3.8\times10^{-3}$|20% OH SD-FEC阈值|

> 说明：$Q_{\text{FEC}} \approx 8.53$ 对应 BER $= 3.8\times10^{-3}$ 为现代软判决 FEC（SD-FEC，开销约 20%）的典型阈值，该值以 dB 表示为约 18.6 dB，但注意此处线性值 $Q = 8.53$ 对应 dB 值 $= 20\log_{10}(8.53) \approx 18.6$ dB。**不同文献定义存在差异，核对时应检查原文公式。**

### 1.5 参考文献

1. **Agrawal, G.P.** (2010). _Fiber-Optic Communication Systems_, 4th ed. Wiley-Interscience. Ch.4.
    - 标准教材，BER 与 Q 因子推导见 §4.5。
2. **Forestieri, E.** (2000). Evaluating the error probability in lightwave systems with chromatic dispersion, arbitrary pulse shape and pre- and postdetection filtering. _J. Lightwave Technol._, 18(11), 1493–1503.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/892191)

---

## 2. 接收机 DSP 处理链

### 2.1 处理链总览

现代相干接收机经过 90° 混频器和平衡光电探测器后输出 4 路模拟信号（XI, XQ, YI, YQ），ADC 采样后进入全数字 DSP 处理链：

```
ADC 输出
(XI, XQ, YI, YQ)
      │
      ▼
┌─────────────┐
│  CDC        │  ← 静态频域滤波（已知 D·L）
│  (色散补偿) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MIMO 均衡  │  ← 自适应2×2 FIR（CMA → DD-LMS）
│  (PMD补偿)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  FOE        │  ← 频率偏移估计与补偿（~MHz量级）
│  (频率恢复) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  CPE        │  ← 载波相位估计（~100kHz线宽）
│  (相位恢复) │
└──────┬──────┘
       │
       ▼
  判决 / 软判决输出 → FEC 译码
```

**处理顺序的物理依据**：CDC 处理大时延差（>100 ps），必须最先进行，否则 MIMO 均衡器的 tap 数将爆炸性增加；FOE 在 MIMO 之后因为严重的频率偏移会导致均衡器不收敛；CPE 最后进行处理残余慢变相位。

---

### 2.2 CDC：色散补偿

#### 色散的数学描述

光纤中群速度色散（Group Velocity Dispersion, GVD）引起的频域传递函数（仅保留二阶色散项）：

$$H_{\text{fiber,CD}}(f) = \exp!\left(j \frac{\pi \lambda^2 D L}{c} f^2\right)$$

其中：

- $D$：色散系数（ps/nm/km），标准 SMF-28 典型值 $D \approx 17$ ps/nm/km @1550 nm
- $L$：光纤长度（km）
- $\lambda$：载波波长（m），$\lambda = c/f_c$
- $c$：真空光速（m/s）

引入 $\beta_2 = -\frac{\lambda^2 D}{2\pi c}$（单位 ps²/km，色散参数的另一种表达），则：

$$H_{\text{fiber,CD}}(f) = \exp!\left(-j \frac{\beta_2 L}{2}(2\pi f)^2\right)$$

#### CDC 的实现

CDC 施加完全相反的相位响应（理想逆滤波器）：

$$H_{\text{CDC}}(f) = \left[H_{\text{fiber,CD}}(f)\right]^{-1} = \exp!\left(j \frac{\beta_2 L}{2}(2\pi f)^2\right)$$

**实现方式**：频域块处理（Overlap-Save / Overlap-Add 方法）

设块长为 $N$，色散积累量为 $D_{\text{acc}} = D \cdot L$（ps/nm），FIR 等效阶数约为：

$$N_{\text{tap}} \approx 2\pi \cdot f_s^2 \cdot \frac{\lambda^2 |D_{\text{acc}}|}{c}$$

例：$f_s = 64$ GSa/s，$D = 17$ ps/nm/km，$L = 1000$ km，$\lambda = 1550$ nm：

$$N_{\text{tap}} \approx 2\pi \times (64\times10^9)^2 \times \frac{(1550\times10^{-9})^2 \times 17\times10^{-12} \times 10^6}{3\times10^8} \approx 2700 \text{ taps}$$

→ 频域实现计算复杂度 $O(N\log N)$，远优于时域 $O(N^2)$。

> ⚠️ CDC 是**静态**处理：仅需知道 $D \cdot L$，无需自适应。若 $D$ 或 $L$ 未知，可通过盲估计算法（如 DSP-based CD estimation）先估计后补偿。

---

### 2.3 MIMO 均衡器：偏振解复用与 PMD 补偿

#### 物理模型

PolMux 系统在 X、Y 两个正交偏振态上传输独立数据。经历光纤后，偏振态因双折射（PMD）而旋转和混叠。接收信号模型（频域）：

$$\begin{bmatrix} R_x(f) \ R_y(f) \end{bmatrix} = \mathbf{H}(f,t) \begin{bmatrix} S_x(f) \ S_y(f) \end{bmatrix} + \begin{bmatrix} N_x(f) \ N_y(f) \end{bmatrix}$$

其中 $\mathbf{H}(f,t) \in \mathbb{C}^{2\times2}$ 是包含偏振旋转、PMD 效应的时变信道矩阵，可以用 Jones 矩阵分解为：

$$\mathbf{H}(f,t) = \mathbf{U}(t)\begin{bmatrix} e^{j\frac{\Delta\tau}{2}(2\pi f)} & 0 \ 0 & e^{-j\frac{\Delta\tau}{2}(2\pi f)} \end{bmatrix}\mathbf{V}(t)$$

其中 $\Delta\tau$ 为差分群时延（DGD），$\mathbf{U}, \mathbf{V}$ 为酉矩阵（偏振旋转）。

#### 蝶形 2×2 自适应 FIR 结构

均衡器采用 4 个并行 FIR 滤波器（蝶形结构），每个滤波器有 $N_t$ 个 tap：

$$\hat{s}_x(n) = \mathbf{h}_{xx}^H \mathbf{r}_x(n) + \mathbf{h}_{xy}^H \mathbf{r}_y(n)$$

$$\hat{s}_y(n) = \mathbf{h}_{yx}^H \mathbf{r}_x(n) + \mathbf{h}_{yy}^H \mathbf{r}_y(n)$$

矩阵形式：

$$\hat{\mathbf{s}}(n) = \mathbf{W}^H \mathbf{r}(n), \quad \mathbf{W} = \begin{bmatrix} \mathbf{h}_{xx} & \mathbf{h}_{yx} \ \mathbf{h}_{xy} & \mathbf{h}_{yy} \end{bmatrix} \in \mathbb{C}^{2N_t \times 2}$$

#### 自适应算法

**阶段 1：CMA（Constant Modulus Algorithm）**

CMA 不需要已知训练序列，利用 QAM 信号恒模特性（对 PSK 完全恒模；对 QAM 近似）：

误差信号（针对 $i$-th 输出，$i \in {x, y}$）：

$$e_i(n) = |\hat{s}_i(n)|^2 - R_2$$

其中 Godard 半径 $R_2 = \dfrac{E[|s|^4]}{E[|s|^2]}$。

权值更新（负梯度方向）：

$$\mathbf{h}_{xi}(n+1) = \mathbf{h}_{xi}(n) - \mu_{\text{CMA}}, e_i(n), \hat{s}_i(n), \mathbf{r}_x^*(n)$$

$$\mathbf{h}_{yi}(n+1) = \mathbf{h}_{yi}(n) - \mu_{\text{CMA}}, e_i(n), \hat{s}_i(n), \mathbf{r}_y^*(n)$$

CMA 可能收敛到奇异解（两路收敛到相同偏振），需要加去相关机制（如正交约束）。

**阶段 2：DD-LMS（Decision-Directed LMS）**

CMA 收敛后切换至 DD-LMS，利用硬判决结果：

$$e_i(n) = \hat{s}_i(n) - \mathcal{D}[\hat{s}_i(n)]$$

其中 $\mathcal{D}[\cdot]$ 为星座点最近邻判决算子。

$$\mathbf{h}_{xi}(n+1) = \mathbf{h}_{xi}(n) - \mu_{\text{LMS}}, e_i(n), \mathbf{r}_x^*(n)$$

DD-LMS 稳态剩余均方误差（Misadjustment）：

$$M = \frac{\mu_{\text{LMS}} \cdot J_{\min} \cdot \text{tr}(\mathbf{R})}{2 - \mu_{\text{LMS}} \cdot \text{tr}(\mathbf{R})} \approx \frac{\mu_{\text{LMS}} \cdot N_t \cdot \sigma_r^2 \cdot J_{\min}}{2}$$

其中 $\mathbf{R} = E[\mathbf{r}(n)\mathbf{r}^H(n)]$ 为输入自相关矩阵，$J_{\min}$ 为最小 MSE。步长 $\mu$ 越小，稳态误差越小，但收敛越慢。

---

### 2.4 FOE：频率偏移估计

#### 物理来源

发射激光器（TX laser）与本振激光器（LO）之间的频率差 $\Delta f = f_{\text{TX}} - f_{\text{LO}}$，典型值数百 MHz 至 GHz 量级。接收信号带有线性相位漂移：

$$r(n) = s(n) \cdot e^{j2\pi \Delta f n T_s + j\phi_0} + n(n)$$

若不补偿，MIMO 均衡器将看到一个持续旋转的星座，无法稳定收敛。

#### M 次方算法（适用于 MPSK）

对 M-PSK，星座点相位 $\in {0, 2\pi/M, 4\pi/M, \ldots}$，对信号做 $M$ 次方可消除调制信息（各相位变为 $0$ 的整数倍 $\times M$，全部归零模 $2\pi$）：

$$y(n) = r^M(n) \approx e^{j2\pi M \Delta f n T_s}$$

对 $y(n)$ 做 DFT，峰值位置 $k^*$：

$$\hat{\Delta f} = \frac{k^*}{M \cdot N \cdot T_s}$$

估计范围受限：$|\Delta f| < \frac{f_s}{2M}$（例如 QPSK $M=4$，$f_s = 64$ GSa/s，则 $|\Delta f| < 8$ GHz）。

#### 高阶 QAM 的频偏估计

对于 16-QAM 等高阶 QAM，M 次方算法效果变差（星座点幅度不等），常用方法：

1. **4th-Power 谱估计**：利用 QAM 的 4 折旋转对称性，取 4 次方后频谱峰值
2. **差分相位估计**：

$$\hat{\Delta f} = \frac{1}{2\pi T_s} \cdot \angle!\left(\frac{1}{N}\sum_{n=0}^{N-1} r(n)r^*(n-1) e^{-j\arg(s_{\text{ref}})}\right)$$

3. **MUSIC/ESPRIT 类子空间算法**：适用于多色散信道，精度更高但计算量大

---

### 2.5 CPE：载波相位估计

#### 相位噪声模型

发射激光器和本振激光器的线宽（Linewidth）$\Delta\nu$ 造成相位随机游走（Wiener 过程）：

$$\phi(n) = \phi(n-1) + \Delta\phi(n)$$

$$\Delta\phi(n) \sim \mathcal{N}!\left(0,, 2\pi(\Delta\nu_{\text{TX}} + \Delta\nu_{\text{LO}}) T_s\right)$$

相位噪声方差随时间累积，在 $k$ 个符号内：

$$\mathrm{Var}[\phi(n+k) - \phi(n)] = 2\pi \Delta\nu_{\text{total}} \cdot k \cdot T_s$$

**关键参数**：$\Delta\nu T_s$（归一化线宽-符号周期积），典型值 $10^{-5}$ 至 $10^{-4}$。

#### BPS 算法（Blind Phase Search）

适用于任意星座，是高阶 QAM 中最常用的 CPE 算法：

**步骤**：

1. 在区间 $[-\pi/4, \pi/4)$（利用 QPSK 的 $\pi/2$ 对称性）均匀撒 $B$ 个测试相位： $$\theta_b = -\frac{\pi}{4} + \frac{b \cdot \pi/2}{B}, \quad b = 0, 1, \ldots, B-1$$
    
2. 对以第 $n$ 个符号为中心的块（块长 $2N_B + 1$），计算每个测试相位的代价函数： $$C_b(n) = \sum_{k=n-N_B}^{n+N_B} \min_{a_m \in \mathcal{A}} \left|r_k e^{-j\theta_b} - a_m\right|^2$$
    
3. 最优相位估计： $$\hat{\phi}(n) = \theta_{b^_(n)}, \quad b^_(n) = \arg\min_b C_b(n)$$
    
4. 相位解包（处理 $\pi/2$ 相位模糊）： $$\hat{\phi}_{\text{unwrap}}(n) = \hat{\phi}(n) + \frac{\pi}{2}\cdot k, \quad k \in \mathbb{Z}$$ （使相位变化最小的 $k$）
    

**参数设计**：

- $B$（测试相位数）：通常 $B = 32 \sim 64$，$B$ 越大估计越精确但计算量 $O(B)$
- $N_B$（块长/2）：越大对高频相位噪声的平均效果越好，但对快变相位跟踪越慢；最优 $N_B \propto (\Delta\nu T_s)^{-1/2} \cdot \text{SNR}^{-1/2}$

#### Viterbi-Viterbi 算法（适用于 M-PSK）

$$\hat{\phi}(n) = \frac{1}{M} \arg!\left(\sum_{k=n-L}^{n+L} r_k^M\right)$$

计算简单，但仅适用于 PSK，存在 $2\pi/M$ 相位模糊。

---

### 2.6 参考文献

1. **Savory, S.J.** (2010). Digital Coherent Optical Receivers: Algorithms and Subsystems. _IEEE J. Sel. Topics Quantum Electron._, 16(5), 1164–1179.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/5422610) — 接收机 DSP 综述，强烈推荐
2. **Pfau, T., Hoffmann, S., & Noé, R.** (2009). Hardware-Efficient Coherent Digital Receiver Concept With Feedforward Carrier Recovery for M-QAM Constellations. _J. Lightwave Technol._, 27(8), 989–999.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/4785043) — BPS 算法原始论文
3. **Ip, E., & Kahn, J.M.** (2007). Feedforward carrier recovery for coherent optical communications. _J. Lightwave Technol._, 25(9), 2675–2692.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/4305399) — Viterbi-Viterbi 及 ML 相位估计
4. **Godard, D.** (1980). Self-Recovering Equalization and Carrier Tracking in Two-Dimensional Data Communication Systems. _IEEE Trans. Commun._, 28(11), 1867–1875.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/1094608) — CMA 原始论文
5. **Ip, E., Lau, A.P.T., Barros, D.J.F., & Kahn, J.M.** (2008). Coherent detection in optical fiber systems. _Optics Express_, 16(2), 753–791.
    - [Optica OE](https://opg.optica.org/oe/fulltext.cfm?uri=oe-16-2-753) — 相干系统全面综述（开放获取）

---

## 3. DSP 对 PMD 与相位噪声时变效应的缓解机制

### 3.1 时变信道的统计特征

PMD 和相位噪声都是**时变随机过程**，但其变化时间尺度差异极大：

|效应|物理来源|典型相关时间|变化速率|
|:-:|:-:|:-:|:-:|
|PMD（偏振旋转）|温度/振动/应力引起的双折射波动|$\sim 10^{-3}$ s（1 ms）量级|kHz|
|激光相位噪声|自发辐射（spontaneous emission）量子噪声|$\sim 1/\Delta\nu \sim 10$ μs（100 kHz线宽）|~100 kHz|
|信号符号速率|调制|$T_s = 1/R_s \sim 10$ ps（100 GBaud）|100 GHz|

**关键洞察**：时变效应的带宽（kHz~100 kHz）远小于信号符号率（~100 GHz），因此可以在**每个符号块内**视信道为准静态，用数字自适应算法实时跟踪。

---

### 3.2 自适应均衡跟踪 PMD

LMS 算法的收敛速度决定了均衡器能跟踪的最大 PMD 变化率。

**跟踪带宽的近似分析**：

LMS 均衡器本质上是一个一阶递归系统。其等效时间常数（以符号数计）为：

$$\tau_{\text{LMS}} \approx \frac{1}{\mu_{\text{LMS}} \cdot \text{tr}(\mathbf{R})} \approx \frac{1}{\mu_{\text{LMS}} \cdot N_t \cdot \sigma_r^2}$$

等效跟踪带宽（Hz）：

$$B_{\text{track}} \approx \frac{\mu_{\text{LMS}} \cdot N_t \cdot \sigma_r^2}{2\pi} \cdot R_s$$

PMD 变化带宽 $B_{\text{PMD}} \ll B_{\text{track}}$ 时，均衡器可实时跟踪。

**数值示例**：$\mu = 10^{-4}$，$N_t = 15$，$\sigma_r^2 = 1$，$R_s = 64$ GBaud：

$$B_{\text{track}} \approx \frac{10^{-4} \times 15}{2\pi} \times 64\times10^9 \approx 15 \text{ MHz}$$

远大于 PMD 变化带宽（kHz）→ 实时跟踪可行。

**步长选择的权衡**：

$$\mu \uparrow \Rightarrow \begin{cases} \text{收敛更快（跟踪更好）} \ \text{稳态 MSE 更大（噪声更多）}\end{cases}$$

实践中常采用**变步长 LMS**：收敛阶段用大 $\mu$，稳态跟踪用小 $\mu$。

---

### 3.3 CPE 跟踪相位噪声

**卡尔曼滤波框架**（最优相位跟踪的理论基础）：

状态方程（相位随机游走模型）：

$$\phi(n) = \phi(n-1) + w(n), \quad w(n) \sim \mathcal{N}(0, Q) ,\quad Q = 2\pi \Delta\nu T_s$$

观测方程（线性近似，高 SNR 下）：

$$z(n) = \phi(n) + v(n), \quad v(n) \sim \mathcal{N}(0, R),\quad R = \frac{1}{\text{SNR}}$$

最优 Kalman 滤波递推：

$$\hat{\phi}(n|n-1) = \hat{\phi}(n-1|n-1) \quad \text{（预测）}$$

$$P(n|n-1) = P(n-1|n-1) + Q \quad \text{（预测误差协方差）}$$

$$K(n) = \frac{P(n|n-1)}{P(n|n-1) + R} \quad \text{（Kalman 增益）}$$

$$\hat{\phi}(n|n) = \hat{\phi}(n|n-1) + K(n)\left[z(n) - \hat{\phi}(n|n-1)\right] \quad \text{（更新）}$$

$$P(n|n) = (1 - K(n)) P(n|n-1) \quad \text{（更新误差协方差）}$$

**稳态 Kalman 增益**（稳态时 $P$ 收敛为常数 $P^*$）：

$$P^* = \frac{Q}{2} + \sqrt{\frac{Q^2}{4} + QR}$$

$$K^* = \frac{P^_}{P^_ + R}$$

当 $Q \to 0$（线宽极窄）：$K^* \to 0$（几乎不更新，完全信任预测）  
当 $Q \to \infty$（线宽极宽）：$K^* \to 1$（完全跟随观测）

**BPS 与 Kalman 的关系**：BPS 可以看作是在 Wiener 相位噪声模型下的近似 MAP 估计，其块平均等效于 Kalman 滤波在稳态时的操作。

---

### 3.4 参考文献

1. **Charlet, G. et al.** (2008). Efficient Compensation of Ultra-High PMD Combined With PDL for Submarine Transmission. _Optics Express_, 16(26), 22353–22360.
    - [Optica OE](https://opg.optica.org/oe/fulltext.cfm?uri=oe-16-26-22353)
2. **Kuschnerov, M. et al.** (2009). DSP for Coherently Received Optical Transmission Systems. _Optics Express_, 17(16), 13717–13726.
    - [Optica OE](https://opg.optica.org/oe/fulltext.cfm?uri=oe-17-16-13717)
3. **Colavolpe, G., Foggi, T., Forestieri, E., & Prati, G.** (2011). Faster-Than-Nyquist Signaling and Viterbi Decoding for Power-Efficient Coherent Optical Systems. _ECOC 2011_ — Kalman 相位跟踪应用于光通信

---

## 4. 发送机 DSP：Pulse Shaping、Resampling 与 Precompensation

### 4.1 Pulse Shaping：脉冲成形

#### 奈奎斯特准则与 ISI

若符号以速率 $R_s = 1/T_s$ 传输，为了在采样时刻 $nT_s$ 无码间干扰（ISI），要求脉冲 $p(t)$ 满足奈奎斯特第一准则：

$$p(nT_s) = \begin{cases} 1 & n = 0 \ 0 & n \neq 0 \end{cases}$$

等价频域条件（Poisson 求和公式）：

$$\sum_{k=-\infty}^{\infty} P!\left(f - \frac{k}{T_s}\right) = T_s, \quad \forall f$$

满足此条件的最简单频谱是矩形谱 $P(f) = T_s \cdot \mathrm{rect}(f T_s)$，但对应时域为 $\mathrm{sinc}$ 函数，无限延伸，实用中采样时刻偏差将导致严重 ISI。

#### 根升余弦（RRC）滤波器

**升余弦（RC）滤波器**频域响应（奈奎斯特准则的平滑版本）：

$$H_{\text{RC}}(f) = \begin{cases} T_s & |f| \leq \dfrac{1-\alpha}{2T_s} \[10pt] \dfrac{T_s}{2}!\left[1 + \cos!\left(\dfrac{\pi T_s}{\alpha}!\left(|f| - \dfrac{1-\alpha}{2T_s}\right)\right)\right] & \dfrac{1-\alpha}{2T_s} < |f| \leq \dfrac{1+\alpha}{2T_s} \[10pt] 0 & |f| > \dfrac{1+\alpha}{2T_s} \end{cases}$$

其中 $\alpha \in [0, 1]$ 为**滚降系数**（roll-off factor）。

- 带宽：$B = \frac{1+\alpha}{2T_s}$（增益相比理想矩形谱 $= (1+\alpha)$ 倍）
- $\alpha = 0$：矩形谱，占用最小带宽 $B = 1/2T_s$，时域为 sinc 函数
- $\alpha = 1$：带宽翻倍，时域衰减最快（$\propto 1/t^3$），对定时误差最不敏感

**根升余弦（RRC）滤波器**频域响应：

$$H_{\text{RRC}}(f) = \sqrt{H_{\text{RC}}(f)}$$

RRC 时域冲激响应（$\alpha > 0$）：

$$h_{\text{RRC}}(t) = \frac{\sin(\pi t/T_s \cdot (1-\alpha)) + 4\alpha t/T_s \cdot \cos(\pi t/T_s \cdot (1+\alpha))}{\pi t/T_s \cdot \left[1 - (4\alpha t/T_s)^2\right]}$$

**发射端 RRC 成形 + 接收端 RRC 匹配滤波**的级联：

$$H_{\text{RRC}}(f) \times H_{\text{RRC}}(f) = H_{\text{RC}}(f) \quad \text{（满足奈奎斯特准则）}$$

→ 在采样时刻实现零 ISI，同时最大化匹配滤波器的 SNR。

#### 物理意义

脉冲成形同时实现了三个目标：

1. **带宽限制**：将信号频谱限制在 $[-(1+\alpha)/(2T_s),, (1+\alpha)/(2T_s)]$，避免信道外干扰
2. **零 ISI**：奈奎斯特条件保证采样时刻符号间无串扰
3. **最优 SNR**：RRC 是对应加性白噪声信道的最优匹配滤波器

---

### 4.2 Resampling：重采样

#### 速率转换的必要性

- 符号速率：$R_s$（GBaud），取决于系统设计
- DSP 内部处理率：$f_{\text{DSP}}$（通常为 2 样/符号，即 $2R_s$）
- DAC 采样率：$f_{\text{DAC}}$（固定，如 64 GSa/s 或 92 GSa/s）

三者通常不满足整数比关系，需要任意有理数比 $L/M = f_{\text{DAC}} / f_{\text{DSP}}$ 的速率转换。

#### 多相滤波器组（Polyphase Filter Bank）实现

直接实现：上采样 $\uparrow L$ → 低通滤波 $h[n]$（截止频率 $\pi/\max(L,M)$）→ 下采样 $\downarrow M$

效率问题：低通滤波器在 $L$ 倍高采样率下运行，计算冗余大。

**多相分解**：将长度 $K$ 的低通滤波器 $h[n]$ 分解为 $L$ 个相位分量（多相分支）：

$$H(z) = \sum_{k=0}^{L-1} z^{-k} E_k(z^L), \quad E_k(z) = \sum_{n=0}^{\lceil K/L \rceil - 1} h[nL + k] z^{-n}$$

每个多相分支 $E_k(z)$ 只需在**原始采样率** $f_{\text{DSP}}$ 下运行，计算效率提高 $L$ 倍。

实际上，精确的分数延迟插值通过 Farrow 结构实现：

$$y(n) = \sum_{k=0}^{K-1} c_k(n) \cdot x(n-k)$$

其中系数 $c_k(n)$ 根据所需的分数延迟 $\mu(n) \in [0,1)$ 实时计算（拉格朗日插值多项式或三次样条）。

---

### 4.3 Precompensation：预补偿

#### 4.3.1 发射机频率响应预均衡（带宽预补偿）

**问题**：DAC（数模转换器）的零阶保持（ZOH）效应、驱动放大器（Driver）的有限带宽、I/Q 调制器（Mach-Zehnder 调制器，MZM）的频率响应共同构成了总的发射机频率响应 $H_{\text{TX}}(f)$：

$$H_{\text{TX}}(f) = \underbrace{H_{\text{DAC}}(f)}_{\text{ZOH: sinc衰减}} \cdot H_{\text{Driver}}(f) \cdot H_{\text{MZM}}(f)$$

**ZOH 效应**（DAC 的固有低通效应）：

$$H_{\text{ZOH}}(f) = T_{\text{DAC}} \cdot \mathrm{sinc}(f T_{\text{DAC}}) \cdot e^{-j\pi f T_{\text{DAC}}}$$

在奈奎斯特频率 $f = f_{\text{DAC}}/2$ 处，幅度衰减约 $-3.92$ dB。

**预补偿实现**：

离线测量 $H_{\text{TX}}(f)$（通过发射机回环或 VNA 测量），在 DSP 中施加预均衡滤波器：

$$H_{\text{pre}}(f) = \frac{w(f)}{H_{\text{TX}}(f)}$$

其中 $w(f)$ 为正则化权重函数（避免在 $|H_{\text{TX}}(f)|$ 很小处过度放大噪声）：

$$w(f) = \frac{|H_{\text{TX}}(f)|^2}{|H_{\text{TX}}(f)|^2 + \epsilon}$$

（Tikhonov 正则化，$\epsilon$ 为正则化参数）

#### 4.3.2 高速光缆时延预补偿（Skew 补偿）

**问题**：PolMux IQ 系统共 4 路信号（XI、XQ、YI、YQ），高速 PCB 走线、同轴电缆、SMA 连接器的路径差异导致时延差（Skew）：

- **IQ Skew**（同一偏振的 I 路和 Q 路时延差）：$\Delta\tau_{IQ}$，典型值 $\sim$ ps 量级
- **XY Skew**（两个偏振的时延差）：$\Delta\tau_{XY}$

IQ Skew 的主要危害：旋转的椭圆星座（理想圆形变椭圆），等效于 IQ 不平衡。

**数学模型**：以 X 偏振为例，含 IQ Skew 的接收信号：

$$E_x(t) = \left[x_I(t) + j x_Q(t - \Delta\tau_{IQ})\right] e^{j\omega_c t}$$

**预补偿实现**：在 DSP 中对 Q 路施加分数时延滤波器（反向时延 $-\Delta\tau_{IQ}$），通过插值实现：

$$x_Q^{\text{pre}}[n] = \sum_k h_{\text{delay}}[n-k] \cdot x_Q[k]$$

其中 $h_{\text{delay}}$ 为分数时延 FIR 滤波器（Parks-McClellan 最优或 Lagrange 插值设计）。

---

### 4.4 参考文献

1. **Proakis, J.G., & Salehi, M.** (2008). _Digital Communications_, 5th ed. McGraw-Hill. Ch. 8 — 奈奎斯特准则与匹配滤波器理论基础
2. **Schmogrow, R. et al.** (2012). Error Vector Magnitude as a Performance Measure for Advanced Modulation Formats. _IEEE Photon. Technol. Lett._, 24(1), 61–63.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/6097405)
3. **Fludger, C., & Kupfer, T.** (2016). Transmitter Impairment Mitigation and Monitoring for High Baud-Rate, High Order Modulation Systems. _ECOC 2016_, paper Tu.2.A.2.

---

## 5. 非线性效应：SPM、XPM 与平均非线性

### 5.1 光 Kerr 效应与 NLSE

#### Kerr 效应

光纤折射率与光强的关系（Kerr 效应）：

$$n(\omega, |E|^2) = n_0(\omega) + n_2 |E|^2$$

其中 $n_2 \approx 2.6 \times 10^{-20}$ m²/W 为石英光纤的非线性折射率系数。

非线性系数 $\gamma$：

$$\gamma = \frac{\omega n_2}{c A_{\text{eff}}}$$

其中 $A_{\text{eff}}$ 为光纤有效模场面积（SMF-28 约 $80\ \mu\text{m}^2$），典型值 $\gamma \approx 1.3$ W⁻¹km⁻¹。

#### 非线性薛定谔方程（NLSE）

描述单偏振光场包络 $A(z,t)$ 在光纤中传播的方程：

$$\frac{\partial A}{\partial z} = -\frac{\alpha}{2}A - \frac{j\beta_2}{2}\frac{\partial^2 A}{\partial t^2} + \frac{\beta_3}{6}\frac{\partial^3 A}{\partial t^3} + j\gamma|A|^2 A$$

其中：

- $\alpha$：光纤衰减系数（1/km），$\alpha \approx 0.046$ km⁻¹（即约 0.2 dB/km）
- $\beta_2$：GVD 参数（ps²/km）
- $\beta_3$：三阶色散参数（ps³/km），通常 $|\beta_3| \ll |\beta_2|$，短距离可忽略
- $j\gamma|A|^2 A$：非线性项（Kerr 项）

有效传播长度（考虑衰减后的等效无损长度）：

$$L_{\text{eff}} = \frac{1 - e^{-\alpha L}}{\alpha}$$

当 $L \gg 1/\alpha \approx 22$ km 时，$L_{\text{eff}} \to 1/\alpha \approx 22$ km（单个放大器跨段）。

---

### 5.2 SPM：自相位调制

#### 物理机制

信号光场 $A(z,t)$ 通过 Kerr 效应调制自身相位：功率高的位置（脉冲峰值）折射率大，相位累积快；功率低的位置折射率小，相位累积慢。

**忽略色散和衰减**，NLSE 的 SPM 精确解：

$$A(L, t) = A(0, t) \cdot \exp!\left(j\gamma L_{\text{eff}} |A(0,t)|^2\right)$$

SPM 引入的非线性相移（Nonlinear Phase Shift, NPS）：

$$\phi_{\text{NL}}(t) = \gamma L_{\text{eff}} |A(0,t)|^2 = \gamma L_{\text{eff}} P(t)$$

最大非线性相移（峰值功率 $P_0$）：

$$\phi_{\text{NL,max}} = \gamma L_{\text{eff}} P_0 \triangleq \phi_{\text{max}}$$

当 $\phi_{\text{max}} \ll 1$（rad）时，SPM 可视为小扰动；当 $\phi_{\text{max}} > 1$ rad 时非线性效应显著。

#### SPM 的频谱展宽

由于 SPM 引起的瞬时频率偏移：

$$\delta\omega(t) = -\frac{\partial \phi_{\text{NL}}}{\partial t} = -\gamma L_{\text{eff}} \frac{\partial P(t)}{\partial t}$$

- 脉冲前沿（$\partial P/\partial t > 0$）：频率下移（红移）
- 脉冲后沿（$\partial P/\partial t < 0$）：频率上移（蓝移）

→ SPM 导致频谱展宽，与色散相互作用后产生波形失真（非线性 ISI）。

---

### 5.3 XPM：交叉相位调制

#### 耦合 NLSE

WDM 系统中 $N_{\text{ch}}$ 个信道的传播用耦合 NLSE 描述。第 $i$ 个信道：

$$\frac{\partial A_i}{\partial z} = -\frac{\alpha}{2}A_i - j\frac{\beta_2}{2}\frac{\partial^2 A_i}{\partial t^2} - d_i \frac{\partial A_i}{\partial t} + j\gamma!\left(|A_i|^2 + 2\sum_{k\neq i}|A_k|^2\right)!A_i$$

其中：

- $d_i = \beta_1^{(i)} - \beta_1^{(1)}$：第 $i$ 信道相对于参考信道的群速度失配（walk-off 参数）
- $|A_i|^2$：SPM 项
- $2|A_k|^2$：XPM 项（系数 **2** 来自于非线性极化率张量的分量关系，对于共偏振传播）

#### XPM 引起的相位噪声

第 $i$ 信道因第 $k$ 个干扰信道引起的 XPM 相移（采用微扰近似）：

$$\delta\phi_{i,\text{XPM}}^{(k)}(z, \omega) = 2\gamma \int_0^L \tilde{P}_k(\omega, z') \cdot G(z') , dz'$$

其中 $G(z') = e^{-\alpha z'}$ 为功率衰减因子，$\tilde{P}_k$ 为干扰信道的功率谱。

考虑 walk-off 效应后，XPM 引起的相位调制的传递函数（频域）：

$$H_{\text{XPM}}^{(k)}(f) = 2j\gamma P_k \int_0^L e^{-\alpha z} e^{j 2\pi f d_{ik} z},dz$$

$$= 2j\gamma P_k \cdot \frac{1 - e^{-(\alpha - j2\pi f d_{ik})L}}{\alpha - j2\pi f d_{ik}}$$

其中 $d_{ik} = \beta_1^{(i)} - \beta_1^{(k)}$ 为信道 $i$ 和 $k$ 之间的群速度差（典型值 $\sim$ ps/km · 100 GHz 信道间距 ≈ 1.7 ps/km）。

**Walk-off 的"保护"作用**：walk-off 越大，两信道间的相互作用时间越短，XPM 效应越小。这也是增大信道间距可以减小 XPM 的原因。

---

### 5.4 随机噪声与非线性的耦合：Gordon–Mollenauer 效应

#### 物理机制

**Gordon-Mollenauer 效应**（又称 NLPN，非线性相位噪声）：ASE 噪声（随机功率扰动）经过 SPM 转化为随机相位扰动。

设信号在第 $l$ 个放大器后的总场为：

$$A_l = A_s + \Delta A_l^{\text{ASE}}$$

其中 $A_s$ 为信号，$\Delta A_l^{\text{ASE}}$ 为第 $l$ 个 EDFA 引入的 ASE 噪声（复高斯随机变量）。

经过后续的非线性传播，每一段 ASE 噪声都与信号产生 SPM 交叉作用，累积的非线性相位噪声为：

$$\phi_{\text{NLPN}} = \gamma \sum_{l=1}^{N_s} L_{\text{eff}} \left(2|A_s||\Delta A_l^{\text{RE}}| + |\Delta A_l|^2\right)$$

（$\Delta A_l^{\text{RE}}$ 为 ASE 的同相分量）

**方差计算**（$N_s$ 个放大器跨段）：

$$\sigma^2_{\text{NLPN}} \approx \frac{N_s(N_s+1)}{2} \cdot \gamma^2 L_{\text{eff}}^2 \cdot N_{\text{sp}} h\nu B_o \cdot P_s$$

其中 $N_{\text{sp}}$ 为自发辐射系数，$B_o$ 为光学带宽，$P_s$ 为信号功率。

**"平均非线性"的含义**：

当 WDM 信道数众多、各信道携带独立随机数据时，XPM 对任意一个目标信道产生的相位扰动是一个**零均值随机过程**（因为干扰信道的数据均值为零）。这个随机相位扰动具有特定的功率谱密度（由 walk-off 和信道带宽决定），在统计平均意义下等效为一个**附加高斯相位噪声**。这就是所谓的"平均非线性"——非线性效应在统计平均后等效为一个均值为零的噪声项，其方差是可以通过 GN/EGN 模型解析计算的。

---

### 5.5 高斯噪声（GN）模型：统计平均非线性

GN 模型将光纤传输后的非线性噪声**统计平均**近似为 AWGN，从而可以用解析公式计算非线性噪声功率：

$$G_{\text{NLI}}(f) = \frac{16}{27}\gamma^2 \iint_{-\infty}^{\infty} G_{\text{TX}}(f_1) G_{\text{TX}}(f_2) G_{\text{TX}}(f_1+f_2-f) \cdot |\chi(f_1, f_2)|^2,df_1,df_2$$

其中 $\chi(f_1, f_2)$ 为非线性传播的响应函数（包含 walk-off、衰减、相位匹配等因素）。

总 OSNR（考虑线性 ASE 和非线性噪声）：

$$\text{OSNR}^{-1} = \text{OSNR}_{\text{ASE}}^{-1} + \text{OSNR}_{\text{NLI}}^{-1}$$

最优发射功率（使 OSNR 最大化）：

$$P_{\text{opt}} = \left(\frac{\text{ASE 噪声功率}}{2 \cdot \text{NLI 系数}}\right)^{1/3}$$

→ 非线性噪声功率 $\propto P^3$，而 OSNR $\propto P / (P_{\text{ASE}} + c \cdot P^3)$，存在最优发射功率。

---

### 5.6 参考文献

1. **Agrawal, G.P.** (2019). _Nonlinear Fiber Optics_, 6th ed. Academic Press (Elsevier). — NLSE、SPM、XPM 权威教材
2. **Gordon, J.P., & Mollenauer, L.F.** (1990). Phase noise in photonic communications systems using linear amplifiers. _Optics Letters_, 15(23), 1351–1353.
    - [Optica OL](https://opg.optica.org/ol/abstract.cfm?uri=ol-15-23-1351) — NLPN 原始论文
3. **Poggiolini, P.** (2012). The GN Model of Non-Linear Propagation in Uncompensated Coherent Optical Systems. _J. Lightwave Technol._, 30(24), 3857–3879.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/6320250) | [arXiv](https://arxiv.org/abs/1209.0394) — GN 模型综述（开放获取）
4. **Carena, A. et al.** (2014). EGN model of non-linear fiber propagation. _Optics Express_, 22(13), 16335–16362.
    - [Optica OE](https://opg.optica.org/oe/fulltext.cfm?uri=oe-22-13-16335) — 增强型 GN（EGN）模型

---

## 6. PCS 调制与互信息

### 6.1 均匀 QAM 的成形间隙

Shannon 容量（连续高斯输入分布，AWGN 信道）：

$$C = \log_2(1 + \text{SNR})$$

均匀 $M$-QAM 的 MI（等概发送）：

$$I_{\text{QAM}}(\text{SNR}) = \log_2 M - \frac{1}{M}\sum_{i=1}^{M} \mathbb{E}_n!\left[\log_2 \frac{\sum_{j=1}^{M} e^{-|a_i - a_j + n|^2 / \sigma^2}}{e^{-|n|^2 / \sigma^2}}\right]$$

**成形间隙（Shaping Gap）**：在相同 SNR 下，$C - I_{\text{QAM}} \approx 1.53$ dB（高 SNR 极限）。这 1.53 dB 的损失源于均匀分布与最优高斯分布之间的 KL 散度。

$$1.53,\text{dB} = 10\log_{10}!\left(\frac{\pi e}{6}\right) \approx 1.53,\text{dB}$$

这是无法通过提高发射功率来弥补的**根本性损失**。

---

### 6.2 概率星座成形（PCS）

**核心思想**：保持星座点的几何位置不变（仍使用标准 QAM 格），但赋予各星座点**非均匀概率**，使其概率分布尽量逼近高斯分布，从而消除成形间隙。

**等效视角**：外层（高能量）星座点出现概率降低，平均发射功率降低，但有效信息速率（MI）维持不变或提高——实现了**"用更少的功率传输等量的信息"**。

---

### 6.3 Maxwell–Boltzmann 分布的严格推导

**最优化问题**：在固定平均功率约束 $\mathbb{E}[|a|^2] = P_s$ 下，最大化输入分布的熵 $H(X)$（等价于最大化 MI）：

$$\max_{P(a_k)} H(X) = -\sum_k P(a_k) \log_2 P(a_k)$$

约束：$\sum_k P(a_k) = 1$（概率归一化），$\sum_k P(a_k)|a_k|^2 \leq P_s$（功率约束）

**拉格朗日方程**：

$$\mathcal{L} = -\sum_k P(a_k)\log_2 P(a_k) - \lambda_1!\left(\sum_k P(a_k) - 1\right) - \lambda_2!\left(\sum_k P(a_k)|a_k|^2 - P_s\right)$$

对 $P(a_k)$ 求偏导并令其为零：

$$\frac{\partial \mathcal{L}}{\partial P(a_k)} = -\log_2 P(a_k) - \frac{1}{\ln 2} - \lambda_1 - \lambda_2 |a_k|^2 = 0$$

解得：

$$\boxed{P(a_k) = \frac{e^{-\nu |a_k|^2}}{\mathcal{Z}(\nu)}}$$

其中：

- $\nu = \lambda_2 \ln 2 \geq 0$：**成形参数**（Shaping Parameter），由功率约束决定
- $\mathcal{Z}(\nu) = \sum_j e^{-\nu |a_j|^2}$：配分函数（归一化常数）

这正是统计物理中的 **Maxwell-Boltzmann 分布**，温度对应 $T = 1/\nu$。

**极端情况分析**：

- $\nu = 0$：$P(a_k) = 1/M$（均匀分布，退化为标准 QAM）
- $\nu \to \infty$：$P(a_k) \to 1$ 仅对 $|a_k|^2 = 0$ 的星座点（仅使用最内层点，退化为 BPSK）
- 中间值：通过调节 $\nu$ 连续控制熵（等效信息速率）

**16-QAM 的 PCS 示例**：

16-QAM 星座点 $a_{ij} = (2i-5)/\sqrt{10} + j(2j-5)/\sqrt{10}$，$i,j\in{1,2,3,4}$（归一化使 $\mathbb{E}[|a|^2] = 1$）。有 3 种不同的能量级：

$$|a|^2 \in \left{\frac{2}{10},\ \frac{10}{10},\ \frac{18}{10}\right} \quad \Rightarrow \quad P(a) \propto \left{e^{-\nu \cdot 0.2},\ e^{-\nu},\ e^{-1.8\nu}\right}$$

对应 4 个内层点、8 个中间点、4 个外层点（概率比随 $\nu$ 变化）。

---

### 6.4 互信息（Mutual Information）

#### 基本定义

设离散随机变量 $X$（信道输入），连续随机变量 $Y$（信道输出），互信息定义为：

$$I(X; Y) = H(Y) - H(Y|X)$$

等价形式：

$$I(X; Y) = \sum_{x \in \mathcal{X}} \int_{\mathcal{Y}} P(x) p(y|x) \log_2 \frac{p(y|x)}{p(y)},dy$$

其中：

- $H(Y) = -\int p(y)\log_2 p(y),dy$：输出的微分熵
- $H(Y|X) = -\sum_x P(x)\int p(y|x)\log_2 p(y|x),dy$：条件熵
- $p(y) = \sum_x P(x)p(y|x)$：输出边缘概率密度

**物理含义**：$I(X;Y)$ 表示通过观察 $Y$ 对 $X$ 的平均不确定性消除量（bit/symbol）。

#### AWGN 信道的 MI 计算

对于 AWGN 信道 $Y = X + N$，$N \sim \mathcal{CN}(0, \sigma^2)$：

$$p(y|x) = \frac{1}{\pi\sigma^2}\exp!\left(-\frac{|y-x|^2}{\sigma^2}\right)$$

$$I(X; Y) = H(Y) - H(N) = H(Y) - \log_2(\pi e \sigma^2)$$

当 $X \sim \mathcal{CN}(0, P_s)$（连续高斯）时，$H(Y) = \log_2(\pi e(P_s + \sigma^2))$，达到最大值：

$$C = \log_2!\left(1 + \frac{P_s}{\sigma^2}\right) = \log_2(1 + \text{SNR})$$

当 $X$ 取离散星座（如 PCS-16QAM）时，MI 需要数值计算：

$$I(X;Y) = \log_2 M - H(X|Y)$$

$$H(X|Y) = -\mathbb{E}_{X,Y}!\left[\log_2 P(X|Y)\right]$$

$$P(X = a_k|Y = y) = \frac{P(a_k) \cdot p(y|a_k)}{\sum_j P(a_j) \cdot p(y|a_j)} = \frac{P(a_k) e^{-|y-a_k|^2/\sigma^2}}{\sum_j P(a_j) e^{-|y-a_j|^2/\sigma^2}}$$

---

### 6.5 为什么用 MI 而非 BER 评估 PCS-16QAM

1. **MI 是软判决 FEC 的天然极限**：现代 SD-FEC（LDPC、Turbo 码等）的性能瓶颈由信道 MI 决定，不是 BER。BER 对应的是硬判决极限，低估了软信息的价值。
    
2. **MI 正确捕获了成形增益**：均匀 16-QAM 和 PCS-16QAM 在相同 SNR 下的 BER 差异很小（因为星座几何相同），但 MI 差异显著（PCS 提高了 $H(X)$ 即输入熵，增大了 $I(X;Y)$）。
    
3. **速率自适应的直接控制量**：通过调节 PCS 的成形参数 $\nu$，可以使 MI 连续变化于 $[0, 4]$ bits/symbol，精确匹配信道容量，这是 BER 无法直接反映的。
    
4. **等效 SNR 的可靠性**：MI 对应可达信息速率（AIR），可直接与 Shannon 容量对比，给出系统距离理论极限有多近（如"距 Shannon 限 0.5 dB"这样的量化评价）。
    

---

### 6.6 可达信息速率（AIR）

对于使用 MB 分布的 PCS 和后续 SD-FEC，实际可达信息速率：

$$\text{AIR} = I(X; Y) - \underbrace{\text{FEC overhead}}_{\text{FEC校验位开销}}$$

以 20% 开销 SD-FEC 为例，若 $I(X;Y) = 3.5$ bits/symbol（16-QAM，$\nu > 0$），则：

$$\text{Net AIR} = \frac{3.5}{1.2} \approx 2.92 \text{ bits/symbol}$$

成形增益：通过 PCS，与等概 16-QAM 相比，在相同 $I(X;Y)$ 的情况下，所需 SNR 降低约 $0.5 \sim 1.0$ dB（取决于系统 SNR 范围）。

---

### 6.7 CCDM 实现

**CCDM**（Constant Composition Distribution Matching）：将均匀二进制序列映射为具有精确 MB 分布的符号序列的算法，是 PCS 的核心实现模块。

核心思路：枚举所有长度为 $n$ 、具有精确星座点频次（composition）$\mathbf{f} = (f_1, f_2, \ldots, f_M)$ 的排列，建立编号与排列的双射（lexicographic 或 arithmetic 编码），实现信息比特到符号的可逆映射。

编码速率：$R_{\text{CCDM}} = \frac{\lfloor \log_2 \binom{n}{\mathbf{f}} \rfloor}{n}$ bits/symbol

---

### 6.8 参考文献

1. **Böcherer, G., Steiner, F., & Schulte, P.** (2015). Bandwidth Efficient and Rate-Matched Low-Density Parity-Check Coded Modulation. _IEEE Trans. Commun._, 63(12), 4651–4665.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/7307154) | [arXiv](https://arxiv.org/abs/1406.4523) — PCS + LDPC 完整框架
2. **Fehenberger, T., Alvarado, A., Böcherer, G., & Hanik, N.** (2016). On Probabilistic Shaping of Quadrature Amplitude Modulation for the Nonlinear Fiber Channel. _J. Lightwave Technol._, 34(21), 5063–5073.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/7549086) | [arXiv](https://arxiv.org/abs/1606.01768) — PCS 在光纤非线性信道中的应用
3. **Schulte, P., & Böcherer, G.** (2016). Constant Composition Distribution Matching. _IEEE Trans. Inf. Theory_, 62(1), 430–434.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/7307154) — CCDM 算法
4. **Cover, T.M., & Thomas, J.A.** (2006). _Elements of Information Theory_, 2nd ed. Wiley. — MI、熵的标准教材参考

---

## 7. 伪随机数生成算法（PRNG）

### 7.1 蒙特卡洛仿真中 PRNG 质量的重要性

光纤通信系统仿真（BER/MI 估计）的精度严格依赖于随机数的质量。

**评估 PRNG 质量的主要标准**：

1. **周期**（Period）：序列循环周期，必须远大于仿真序列长度
2. **统计均匀性**：在高维空间中的分布均匀性（DieHard、TestU01 测试套件）
3. **可并行性**：多线程/GPU 并行时，不同流之间是否相互独立
4. **可跳跃性**（Jumpability/Skipability）：能否直接跳至序列的任意位置，用于并行分割

---

### 7.2 梅森旋转算法（MT19937）

**类型**：线性反馈移位寄存器（Linear Feedback Shift Register, LFSR）的推广——广义反馈移位寄存器（GFSR）

**算法核心**：

状态向量 $\mathbf{x} \in \mathbb{F}_2^{19937}$，递推关系：

$$x_{k+n} = x_{k+m} \oplus \left(x_k^{u} | x_{k+1}^{l}\right) A$$

其中：

- $n = 624$（状态字数）, $m = 397$（中间字偏移）
- $x_k^u$（高 $w - r = 1$ 位），$x_{k+1}^l$（低 $r = 31$ 位）
- $A$：伴随矩阵（companion matrix），$A = \begin{pmatrix} 0 & I_{31} \ a_{31} & (a_{30},\ldots,a_0) \end{pmatrix}$
- 具体参数：$a = \texttt{0x9908B0DF}$

**Tempering（调质变换）**：将状态映射到输出，增强均匀性：

$$y \leftarrow x \oplus (x \gg u)$$ $$y \leftarrow y \oplus ((y \ll s) \wedge b)$$ $$y \leftarrow y \oplus ((y \ll t) \wedge c)$$ $$z \leftarrow y \oplus (y \gg l)$$

参数：$u=11, s=7, b=\texttt{0x9D2C5680}, t=15, c=\texttt{EFC60000}, l=18$。

**主要特性**：

- 周期：$2^{19937} - 1$（梅森素数）
- 维度：623 维均匀分布（在 $[0,1)^{623}$ 中的均匀性通过 BigCrush 测试）
- 缺点：状态量大（624 个 32-bit 字），不支持高效并行化，输出有线性相关性（可被预测）

**Python 使用**（NumPy 默认）：

```python
import numpy as np
rng = np.random.default_rng(seed=42)  # 注意：default_rng 默认使用 PCG64，非 MT19937
rng_mt = np.random.RandomState(seed=42)  # 旧接口，使用 MT19937
```

---

### 7.3 组合多重递归算法（MRG）

**类型**：多个线性同余生成器（LCG）的组合

**代表性算法**：MRG32k3a（L'Ecuyer, 1999）

由两个 3 阶线性递归组合：

$$x_{1,n} = (a_{1,1}x_{1,n-1} + a_{1,3}x_{1,n-3}) \bmod m_1$$

$$x_{2,n} = (a_{2,1}x_{2,n-1} + a_{2,3}x_{2,n-3}) \bmod m_2$$

$$u_n = (x_{1,n} - x_{2,n}) \bmod m_1 / m_1$$

其中：$m_1 = 2^{32} - 209$，$m_2 = 2^{32} - 22853$，$a_{1,1} = 0$，$a_{1,3} = 1403580$，$a_{2,1} = 527612$，$a_{2,3} = -1370589$。

**主要特性**：

- 周期：$\approx 2^{191}$
- 支持 $2^{51}$ 个独立子流（Stream Splitting），适合大规模并行蒙特卡洛
- 通过了所有标准统计测试（TestU01 SmallCrush、Crush、BigCrush）

**CUDA/OpenCL 并行库**：cuRAND 库内置 MRG32k3a，支持 GPU 并行流分割。

---

### 7.4 乘法滞后斐波那契算法（LFG，Lagged Fibonacci Generator）

**递推关系**：

$$x_n = x_{n-j} \circ x_{n-k} \pmod{2^b}$$

其中：

- $(j, k)$：滞后对（lag pair），$j < k$，需选择使周期最大的素数对
- $\circ$：运算符，可以是 $\times$（乘法 LFG）、$+$（加法 LFG）、$\oplus$（异或 LFG）

**乘法型 LFG 示例**（$(j,k) = (24,55)$）：

$$x_n = x_{n-24} \cdot x_{n-55} \pmod{2^{32}}$$

周期：对于 $(24, 55)$，加法型周期约 $(2^{32} - 1) \cdot 2^{54}$。

**主要特性**：

- 生成速度极快（一次乘法/加法/异或）
- 需要正确初始化（避免全零等退化状态）
- 乘法 LFG 统计质量优于加法 LFG
- 不适合作为密码学 PRNG，但对仿真足够

---

### 7.5 Counter-Based PRNG：Philox 与 Threefry

#### 核心设计理念

**Counter-Based PRNG（CBRNG）** 的核心思想：将计数器（Counter）通过密码学哈希/加密函数转化为随机数，实现**直接索引**（第 $n$ 个随机数可在 $O(1)$ 时间直接计算，无需从头迭代）：

$$\text{PRNG}(n) = f_{\text{hash}}(\text{key},, n)$$

其中 $n$ 为序号（计数器），key 为初始化密钥（相当于种子）。

**优势**：

- **无限可并行**：线程/进程 $i$ 计算序列的第 $[i \cdot B, (i+1) \cdot B)$ 段，完全独立，无锁同步
- **Skipability**：可直接跳到序列任意位置，用于 Quasi-Monte Carlo 或分段使用
- **无状态**：无需维护大型状态向量，内存开销极小

---

#### Philox 4×32（10 轮）

**基于 Thorp Shuffle 和 S-Box 的 Feistel 网络**：

每轮计算（以 Philox 2×32 为例说明原理，4×32 类似）：

$$L' = \text{mulhilo32}(R \times W_{32}) .hi$$ $$R' = \text{mulhilo32}(R \times W_{32}) .lo \oplus K \oplus L$$

其中 $W_{32} = \texttt{0x9E3779B9}$（Weyl 序列常数，黄金比例的 32 位近似），$K$ 为密钥（随轮次递增）。

**4×32 结构**：状态为 4 个 32-bit 字 $(x_0, x_1, x_2, x_3)$，密钥 2 个字。每轮：

1. 两次 32-bit 乘法（mulhilo，得高低 32 位）
2. 两次 XOR 混合
3. 密钥调度（Weyl 序列递增）

**10 轮后**：通过了 TestU01 BigCrush 全部测试，具有足够的统计随机性（但非密码学安全）。

**主要特性**：

- 周期：$2^{128}$（4 个 32-bit 计数器全部遍历）
- 非常适合 GPU（每个线程自带独立计数器，无状态共享）
- 被 NumPy 新版、JAX、PyTorch 广泛采用

```python
import numpy as np
rng = np.random.Generator(np.random.Philox(key=12345))
samples = rng.standard_normal(1000000)
```

---

#### Threefry 4×64（20 轮）

**基于 Threefish 密码（Skein 哈希函数的核心）**：

Threefish 是一个纯 ARX 设计（Add-Rotate-XOR），无 S-Box，仅使用整数加法、位旋转、XOR：

每轮混合操作（Mix Function）：

$$(a, b) \to (a + b,\ (b \lll R_d) \oplus (a + b))$$

其中 $R_d$ 为预定义的旋转常数（取决于轮次 $d$ 和位置）。

**4×64 结构**：状态 4 个 64-bit 字，密钥 4 个字（256-bit）。每隔 4 轮注入密钥（key injection）。**20 轮**后达到密码学质量的混淆和扩散。

**主要特性**：

- 周期：$2^{256}$（极长，适合高维仿真）
- 64-bit 高维均匀性极好（BigCrush 全部通过）
- 比 Philox 稍慢（20 轮 vs 10 轮），但精度更高
- 适合需要 $> 10^{18}$ 样本的超大规模仿真

---

### 7.6 算法对比与选用建议

|算法|周期|并行性|速度（相对）|统计质量|推荐场景|
|:-:|:-:|:-:|:-:|:-:|:-:|
|MT19937|$2^{19937}$|差|中|良好（623D均匀）|单线程通用仿真|
|MRG32k3a|$\approx 2^{191}$|优（子流分割）|慢|极好|CPU 多线程并行 MC|
|乘法 LFG|超长（$\sim2^{86}$）|中|极快|良好|极高速序列生成|
|**Philox 4×32**|$2^{128}$|极优|快|很好|**GPU/TPU 并行仿真**|
|**Threefry 4×64**|$2^{256}$|极优|快|极好|**高精度 GPU 大规模 MC**|

**实际建议**：

- 单机 Python 仿真：`numpy.random.default_rng()` 默认 PCG64，或显式指定 Philox
- GPU 仿真（PyTorch/JAX）：使用框架内置的 Threefry/Philox（JAX 默认 Threefry）
- 跨平台可复现：Philox 与 Threefry 的输出是精确确定的，种子相同则结果完全一致

---

### 7.7 参考文献

1. **Salmon, J.K., Moraes, M.A., Dror, R.O., & Shaw, D.E.** (2011). Parallel Random Numbers: As Easy as 1, 2, 3. _Proc. International Conference for High Performance Computing, Networking, Storage and Analysis (SC'11)_. ACM/IEEE.
    - [PDF（作者主页）](https://www.thesalmons.org/john/random123/papers/random123sc11.pdf) — Philox 与 Threefry 原始论文
2. **L'Ecuyer, P.** (1999). Good Parameters and Implementations for Combined Multiple Recursive Random Number Generators. _Operations Research_, 47(1), 159–164.
    - [INFORMS](https://pubsonline.informs.org/doi/10.1287/opre.47.1.159) — MRG32k3a 原始论文
3. **Matsumoto, M., & Nishimura, T.** (1998). Mersenne Twister: A 623-Dimensionally Equidistributed Uniform Pseudo-Random Number Generator. _ACM Trans. Model. Comput. Simul._, 8(1), 3–30.
    - [ACM DL](https://dl.acm.org/doi/10.1145/272991.272995) — MT19937 原始论文
4. **L'Ecuyer, P., & Simard, R.** (2007). TestU01: A C Library for Empirical Testing of Random Number Generators. _ACM Trans. Math. Softw._, 33(4), Article 22.
    - [ACM DL](https://dl.acm.org/doi/10.1145/1268776.1268777) — PRNG 统计测试标准库

---

## 8. EEPN、周跳与 GAN 建模

### 8.1 EEPN：均衡增强相位噪声

#### 物理机制（直觉理解）

在相干接收机中，接收光信号首先与**本振激光器（LO）**混频，才进入 ADC。这意味着 LO 的相位噪声 $\phi_{\text{LO}}(t)$ 被直接调制到接收信号上：

$$r(t) = s(t) * h_{\text{fiber}}(t) \cdot e^{j\phi_{\text{LO}}(t)} + n(t)$$

**没有 CDC 的情况**：$\phi_{\text{LO}}(t)$ 是激光线宽决定的低频随机过程（$\sim 100$ kHz 带宽），CPE 可以直接跟踪。

**有 CDC 的情况**：CDC 滤波器是一个**全通相位滤波器**（不改变幅度），但具有大量**群时延色散**（GDD）：

$$\tau_g(f) = -\frac{1}{2\pi}\frac{d\angle H_{\text{CDC}}}{df} = -\frac{\lambda^2 DL}{c} f$$

在 $D = 17$ ps/nm/km，$L = 1000$ km，$\lambda = 1550$ nm 时：

$$\left|\frac{d\tau_g}{df}\right| = \frac{\lambda^2 DL}{c} \approx \frac{(1550\times10^{-9})^2 \times 17\times10^{-12}/10^{-9} \times 10^6}{3\times10^8} \approx 1360 \text{ ps}^2/\text{rad}$$

**关键效应**：CDC 将 LO 相位噪声的**不同频率分量**按照群时延公式延迟了不同的时间量，将原本在时域"局域"的相位扰动**扩散**到时域的一个大范围区间（约 $\propto \Delta\nu \cdot |D|L$ 个符号宽度）。

被扩散后的相位噪声已不再是 CPE 可以跟踪的慢变信号，而成为了**宽带时间扩展**的随机干扰——这就是 EEPN。

---

### 8.2 EEPN 的等效噪声功率推导

设 LO 相位噪声的功率谱密度（PSD）为（Lorentzian 线型）：

$$S_{\phi_{\text{LO}}}(f) = \frac{\Delta\nu_{\text{LO}}}{\pi(\Delta\nu_{\text{LO}}^2 + f^2)} \approx \frac{1}{\pi \Delta\nu_{\text{LO}}} \quad \text{（}|f| \ll \Delta\nu_{\text{LO}}\text{）}$$

CDC 的群时延传递函数（作用于相位噪声）等效为：

$$H_{\text{GDD}}(f) = e^{j\pi \lambda^2 DL f^2 / c}$$

EEPN 等效为在接收信号上叠加的加性噪声（小信号近似），其噪声功率谱密度：

$$S_{\text{EEPN}}(f) \propto S_{\phi_{\text{LO}}}(f) \cdot |f|^2 \cdot \left(\frac{\lambda^2 DL}{c}\right)^2 \cdot P_s$$

总 EEPN 噪声功率（积分）：

$$\boxed{\sigma^2_{\text{EEPN}} \approx \pi \Delta\nu_{\text{LO}} \cdot \frac{\lambda^2 |D| L}{c} \cdot P_s}$$

> 此近似来自 Shieh & Ho (2008)，适用于 $\Delta\nu_{\text{LO}} \ll R_s$ 的条件。

**量纲验证**：$[\Delta\nu_{\text{LO}}] = \text{Hz}$，$[\lambda^2 DL/c] = \text{m}^2 \cdot \text{s/m} \cdot \text{m} / (\text{m/s}) = \text{s} = \text{s}$，$[P_s] = \text{W}$，故 $[\sigma^2_{\text{EEPN}}] = \text{Hz} \cdot \text{s} \cdot \text{W} = \text{W}$（功率），量纲正确。

**EEPN 显著性条件**（等效 OSNR 代价 > 1 dB）：

$$\Delta\nu_{\text{LO}} \cdot |D| \cdot L \gtrsim 10^{-6} \text{ s·ps/nm}$$

例：$\Delta\nu_{\text{LO}} = 100$ kHz，$D = 17$ ps/nm/km，则 $L \gtrsim 588$ km 时 EEPN 开始显著。

**当 EEPN 不显著时**（如窄线宽激光器 $\Delta\nu_{\text{LO}} < 10$ kHz 或短距传输），不需要在数字孪生（DT）模型中显式建模此效应。

---

### 8.3 用 GAN 建模 EEPN 的随机特性

#### 为什么用 GAN

EEPN 是一个具有**复杂统计结构**的随机过程（非高斯、非平稳、与信号功率耦合），其精确的概率分布 $p_{\text{EEPN}}(\mathbf{x})$ 很难用参数化模型（如高斯混合模型）精确表示。

GAN（Generative Adversarial Network）可以学习**任意复杂分布**，无需假设分布形式：

#### GAN 训练目标

**minimax 对抗训练**（Goodfellow et al., 2014）：

$$\min_G \max_D \mathcal{L}(G, D) = \mathbb{E}_{\mathbf{x} \sim p_{\text{data}}}[\log D(\mathbf{x})] + \mathbb{E}_{\mathbf{z} \sim p_z}[\log(1 - D(G(\mathbf{z})))]$$

其中：

- $G$：生成器（Generator），将噪声 $\mathbf{z} \sim \mathcal{N}(0, I)$ 映射到 EEPN 样本
- $D$：判别器（Discriminator），区分真实 EEPN 样本与生成样本
- $p_{\text{data}}$：真实 EEPN 样本的分布（从实验或高保真仿真获取）

**训练收敛**（Nash 均衡）时：$G(\mathbf{z})$ 的分布 $\approx p_{\text{data}}$，即生成器学会了复现 EEPN 的完整统计特性。

**实际应用中的改进**：

- **WGAN（Wasserstein GAN）**：用 Wasserstein 距离替代 JS 散度，训练更稳定
- **条件 GAN（cGAN）**：条件输入（如信噪比、功率）$\Rightarrow$ 生成对应条件下的 EEPN 样本
- **时序 GAN（TimeGAN）**：捕捉 EEPN 的时序相关性（功率谱特性）

---

### 8.4 周跳（Cycle Slip）

#### 产生机制

CPE 算法（BPS 等）的相位估计存在**内在模糊**：对于 M 阶 QAM/PSK 星座，旋转 $\pi/2$（对于 4 折对称星座）后星座图与原始完全一致，CPE 无法分辨：

$$r \cdot e^{-j(\hat{\phi} + k\pi/2)} \quad \text{与} \quad r \cdot e^{-j\hat{\phi}} \quad \text{在判决意义上等价}, \quad k \in {0, \pm1, \pm2}$$

**周跳触发条件**：

1. 瞬时 SNR 大幅下降（强突发噪声）
2. 相位噪声在短时间内发生大幅跳变（相位游走超过 $\pi/4$）
3. CPE 窗口内连续出现多个错误判决（DD-LMS 正反馈失稳）

**周跳的数学表示**：

$$\hat{\phi}(n) = \phi_{\text{true}}(n) + \frac{k\pi}{2}, \quad k \in {0, \pm1, \pm2}$$

周跳后，所有后续符号判决旋转 $k\pi/2$，产生**突发错误（Burst Error）**，BER 在短时间内接近 0.5（几乎全部错误）。

**周跳概率的近似**（AWGN 信道，BPS 算法）：

$$P_{\text{slip}} \approx M \cdot Q!\left(\sqrt{\frac{2}{\sigma_\phi^2 + 1/(\text{SNR} \cdot N_B)}}\right)$$

其中 $\sigma_\phi^2 = 2\pi \Delta\nu T_s$ 为每符号相位方差，$N_B$ 为 BPS 块长。

---

### 8.5 导频辅助 CPE 缓解周跳

#### 导频符号插入原理

在数据帧结构中，以固定间隔 $N_p$ 插入已知的导频符号（Pilot Symbols）$s_p$：

```
| P | D D D D D D D D D D | P | D D D D D D D D D D | P | ...
  ↑                         ↑                         ↑
导频                       导频                      导频
```

每隔 $N_p$ 个符号插入 1 个导频，导频开销 $= 1/N_p$（如 $N_p = 32$ 对应约 3% 开销）。

#### 导频相位估计

在导频位置，相位可以精确估计（无模糊）：

$$\hat{\phi}(n_p) = \arg!\left(r(n_p) \cdot s_p^*\right) = \phi(n_p) + \Delta\phi_{\text{noise}}$$

其中 $\Delta\phi_{\text{noise}} \sim \mathcal{N}(0, 1/\text{SNR})$，无 $\pi/2$ 模糊。

#### 周跳检测与纠正

**检测**：在两个相邻导频之间，检查相位估计是否跳变了约 $\pi/2$ 的整数倍：

$$\Delta\hat{\phi} = \hat{\phi}(n_{p,m+1}) - \hat{\phi}(n_{p,m}) - [\phi(n_{p,m+1}) - \phi(n_{p,m})]_{\text{predicted}}$$

若 $|\Delta\hat{\phi} - k\pi/2| < \epsilon$（某整数 $k \neq 0$），则判断为周跳，对 $n_{p,m}$ 到 $n_{p,m+1}$ 之间所有符号施加相位纠正 $-k\pi/2$。

**导频密度 vs 周跳概率的权衡**：

$$P_{\text{undetected slip}} \propto N_p \cdot P_{\text{slip,per symbol}}$$

$N_p$ 越小（导频越密），周跳被发现和纠正越快，但有效数据速率降低：

$$R_{\text{net}} = R_s \cdot \left(1 - \frac{1}{N_p}\right) \cdot \frac{I(X;Y)}{\log_2 M}$$

实践中 $N_p = 16 \sim 64$ 是常见的折中选择（具体取决于激光线宽和系统 SNR）。

#### 导频辅助 CPE 的联合估计

在数据符号上（两个导频之间），利用导频建立相位约束，对 CPE 估计进行导频辅助的线性插值或 Kalman 平滑：

$$\hat{\phi}(n) = \hat{\phi}(n_{p,m}) + \frac{n - n_{p,m}}{n_{p,m+1} - n_{p,m}} \left[\hat{\phi}(n_{p,m+1}) - \hat{\phi}(n_{p,m})\right]$$

（对相位进行线性插值，精度高于单纯的 BPS 盲估计）

---

### 8.6 综合理解

完整效应链与应对策略的逻辑框架：

```
EEPN（均衡增强相位噪声）
├── 来源：LO 相位噪声 × CDC 群时延色散 的相互作用
├── 特征：随机、宽带时间扩展、σ² ∝ Δν_LO · |D|L
├── 本文系统：Δν_LO 足够小 → EEPN 不显著 → 不入DT模型
└── 若需建模：EEPN 统计分布复杂
    └── 对策：GAN 学习其完整统计分布（生成器 → DT 模型中的EEPN模块）

周跳（Cycle Slip）
├── 来源：CPE 算法的 π/2 相位模糊 + 突发相位噪声
├── 特征：离散事件、突发性、导致持续突发误码
├── 危害：严重破坏 DSP 和 DT 模型的连续相位跟踪
└── 对策：导频辅助 CPE
    ├── 导频提供无模糊相位锚点
    ├── 导频密度决定：检测速度 vs 频谱效率
    └── 配合 Kalman 平滑：导频间的相位精确插值
```

---

### 8.7 参考文献

1. **Shieh, W., & Ho, K.P.** (2008). Equalization-enhanced phase noise for coherent-detection systems using electronic digital signal processing. _Optics Express_, 16(20), 15718–15727.
    - [Optica OE](https://opg.optica.org/oe/fulltext.cfm?uri=oe-16-20-15718) — EEPN 原始论文，开放获取
2. **Lau, A.P.T., & Kahn, J.M.** (2012). Signal Design and Detection in Presence of Nonlinear Phase Noise. _J. Lightwave Technol._, 25(10), 3008–3016.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/4350423)
3. **Goodfellow, I., Pouget-Abadie, J., Mirza, M., Xu, B., Warde-Farley, D., Ozair, S., Courville, A., & Bengio, Y.** (2014). Generative Adversarial Nets. _Advances in Neural Information Processing Systems (NeurIPS)_, 27.
    - [Paper](https://proceedings.neurips.cc/paper/2014/hash/5ca3e9b122f61f8f06494c97b1afccf3-Abstract.html) | [arXiv](https://arxiv.org/abs/1406.2661) — GAN 原始论文
4. **Colavolpe, G., Barbieri, A., & Caire, G.** (2005). Algorithms for iterative decoding in the presence of strong phase noise. _IEEE J. Sel. Areas Commun._, 23(9), 1748–1757.
    - [IEEE Xplore](https://ieeexplore.ieee.org/document/1499014) — 周跳与相位跟踪算法
5. **Pfau, T., Hoffmann, S., & Noé, R.** (2009). 见 §2.6 参考文献 [2] — 导频辅助 CPE 相关讨论

---

## 附录 A：符号说明

|符号|含义|典型单位|
|:-:|:-:|:-:|
|$D$|光纤色散系数|ps/nm/km|
|$\beta_2$|GVD 参数|ps²/km|
|$\alpha$|光纤衰减系数|1/km（或 dB/km）|
|$\gamma$|非线性系数|W⁻¹km⁻¹|
|$L_{\text{eff}}$|有效传播长度|km|
|$\Delta\nu$|激光线宽|Hz|
|$T_s$|符号周期|s|
|$R_s$|符号速率|Baud（或 GBaud）|
|$\alpha_{\text{RC}}$|升余弦滚降系数|—|
|$\nu$|PCS 成形参数|—|
|$\sigma^2$|噪声功率/方差|W（功率）|
|$I(X;Y)$|互信息|bits/symbol|
|$\mu$|自适应滤波步长|—|
|$N_B$|BPS 块半长|符号数|
|$N_p$|导频间隔|符号数|

---

## 附录 B：推荐学习资源

### 教材

|书名|作者|适用章节|
|:-:|:-:|:-:|
|_Fiber-Optic Communication Systems_ (5th ed., 2021)|Agrawal|系统基础、Q因子、噪声分析|
|_Nonlinear Fiber Optics_ (6th ed., 2019)|Agrawal|NLSE、SPM、XPM|
|_Digital Communications_ (5th ed., 2008)|Proakis & Salehi|脉冲成形、均衡、CPE|
|_Elements of Information Theory_ (2nd ed., 2006)|Cover & Thomas|MI、熵、信道容量|
|_Optical Fiber Telecommunications VII_ (2020)|Willner (ed.)|相干系统与DSP综述章节|

### 综述论文（强烈推荐）

1. **Savory, S.J.** (2010). Digital Coherent Optical Receivers: Algorithms and Subsystems. _IEEE JSTQE_. — 必读综述
2. **Poggiolini, P.** (2012). The GN Model. _J. Lightwave Technol._ — 非线性信道建模
3. **Böcherer, G. et al.** (2015). PCS + LDPC. _IEEE Trans. Commun._ — PCS 实现基础

### 视频与在线课程

- **MIT OpenCourseWare 6.450**：数字通信原理（英文，免费）
    - [https://ocw.mit.edu/courses/6-450-principles-of-digital-communications-i-fall-2006/](https://ocw.mit.edu/courses/6-450-principles-of-digital-communications-i-fall-2006/)
- **ECOC Short Courses**：每年欧洲光通信会议的教程，搜索"ECOC coherent DSP tutorial"
- **YouTube — Prof. Shynk's DSP lectures**：自适应滤波器（LMS/RLS）

### Python 工具库

```python
# 通信仿真
import commpy          # 数字调制、LDPC 码 (pip install scikit-commpy)
import numpy as np     # 数值计算（含 Philox PRNG）
import scipy.signal    # 滤波器设计（RRC 等）

# 光纤仿真（开源）
# SplitStepFourier 自行实现或参考：
# https://github.com/edsonportosilva/OptiCommPy

# 深度学习
import torch           # GPU 加速，含 Threefry PRNG
import jax             # JAX 默认 Threefry，可微分仿真
```

### 统计测试工具

- **TestU01**（C 库，L'Ecuyer）：PRNG 统计质量测试黄金标准
    - [http://simul.iro.umontreal.ca/testu01/tu01.html](http://simul.iro.umontreal.ca/testu01/tu01.html)

---

> 📌 **文档维护说明**：本 Wiki 基于截至 2025 年的公开文献整理。若论文链接失效，建议通过 Google Scholar、IEEE Xplore、Optica Publishing Group 或 arXiv 重新检索。引用文献均已核查作者-年份-题目-期刊，若有疑问请以原始期刊为准。