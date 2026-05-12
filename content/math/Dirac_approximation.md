# Normal Distribution-based Dirac Delta Function Approximation

## The Toy Example 2

The power can be expressed as a function of distance $z$, so we can express the function of power as an ODE:


$$\frac{\partial P(z)}{\partial z} = -\frac{\alpha}{2} P(z)$$

The solution of this ODE is obvious: $P(z) = e^{(-\alpha z/2)} P(0)$.

When we introduce an amplifier at the end of a span, the attenuation term can be expressed as:

$$-\frac{\alpha}{2} + \frac{\alpha}{2} L_s \sum_{i=1}^{N_s} \delta(z - iL_s)$$

So the ODE becomes:

$$\frac{\partial P(z)}{\partial z} = \left[-\frac{\alpha}{2} + \frac{\alpha}{2} L_s \sum_{i=1}^{N_s} \delta(z - iL_s)\right] P(z)$$

Our purpose is to learn $P(z)$ based on residual loss from this ODE with amplifier. Currently, the Dirac delta function is implemented via `jnp.where`, but it doesn't work.

---

## Expression of Normal Distribution

The expression of the normal distribution is:

$$f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$

where $\mu$ is the mean and $\sigma$ is the standard deviation.


> **Figure:** Normal distribution with different means and variances. The red curve is the standard normal distribution.

![[image 20260417164726.png]]

---

## Expression for Dirac Delta and Gaussian Approximation

The Dirac delta function is a generalized function on the real numbers, whose value is zero everywhere except at zero, and whose integral over the entire real line equals one [[1]]. It can be modeled as a zero-centered normal distribution:

$$\delta_a(x) = \frac{1}{|a|\sqrt{\pi}} e^{-(x/a)^2}$$

When $a \to 0$, analogous to the normal distribution's variance becoming small, the peak value grows unboundedly.

---
## References

<a id="1">[1]</a> Available at https://en.wikipedia.org/wiki/Dirac_delta_function.