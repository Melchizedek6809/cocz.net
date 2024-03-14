+++
title = "Trade-offs between Single- and Multiple-Dispatch"
date = "2024-03-14"

[taxonomies]
tags = ["tech", "plt"]
+++

Lately I've been thinking about the trade-offs between multiple-dispatch and single-dispatch.

Single-dispatch has its appeal in its simplicity. The process involves traversing the inheritance/prototype chain until a method with a matching name is found and returned. This is efficient to implement, allowing us to do method-looup even at runtime. Moreover, determining which specific method to use is easy — it's the first one found, which happens to be the most specific implementation.

All of this gets much more complicated if we use multiple-dispatch, since determining the most specific implementation isn't just walking up a chain. Instead we probably need to get all multimethods applicable, then calculate how specific each method is for the given arguments, and finally choose the most specific one. This would be quite slow to do during runtime, although proper inline-caching could make this manageable.

However, validating the inline cache's validity is more straightforward with single-dispatch. Just compare the type of the first argument to the one stored in the inline cache. With multiple-dispatch, each argument's type must be stored in the inline cache, requiring a comparison of all types on every call.

Ultimately, I believe that multimethods only really work when the majority of types/methods are known at compile-time. In such cases, the efficiency of method lookup becomes less crucial since there should be no runtime cost associated with it.