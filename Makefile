all: build

build:
	mos build --local --verbose

clean:
	rm -rf build