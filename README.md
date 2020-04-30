# slate-ottype
This repository is an attempt to supply SlateJS with real-time collaboration through operational transformation using ShareDB and a custom ottype.

# Install
In the root run
```
    yarn
```

# How to start
To start the demo slate with a server. Run the following two commands.
```
    yarn workspace example start 
    yarn workspace example server
```

# Run tests for library using fuzzer
```
    yarn workspace slate-ot test
```

# Package structure
The package example contains a bare-bone example on how to use the slate-ot library. The package slate-ot contains the actual operation transformation logic.

# Short introduction to operational transformation and ShareDB.
Please see this short [PDF](/theory.pdf).
