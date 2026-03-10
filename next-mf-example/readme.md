This example showcases usage of module-federatiuon/nextjs-mf.

This example creates moves authentication, header, footer in host and loads app1 on runtime in host (Host loads application at runtime)

It also consist of usage of header, footer as components at runtime in app2 from host (remote apps load components from host at runtime)

Key things to note down about module-federation/nextjs-mf

1. It does not support Next 16
2. It does not support App router
3. The library is now in maintanence mode

The better way is to work with example 1 using **next-rspack** and **@module-federation/enhanced** but only drawback is next-rspack is in experimental mode thus is not very stable
