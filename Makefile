

.PHONY: build clean

build:
	mos build --local --verbose

clean:
	rm -rf build
