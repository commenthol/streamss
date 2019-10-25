engines = 8 10 12 13

all: engines

engines: $(engines)

$(engines):
	@ n $@
	@ npm test

.PHONY: all \
	engines $(engines)
