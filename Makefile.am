AUTOMAKE_OPTIONS = foreign
FILES = changeloggen.sh com.omicronlab.avro.gschema.xml configure.ac database-compiler.js Database.db3 ibus-avro.xml.in ibus-setup-ibus-avro.desktop.in main-gjs.js Makefile.am pref.js README.md

all: build
	@:
	
build: ibus-avro.xml ibus-setup-ibus-avro.desktop main-gjs.js pref.js
	@:

%: %.in ibus-avro.xml.in ibus-setup-ibus-avro.desktop.in
	$(AM_V_GEN) \
	( \
		libexecdir=${libexecdir}; \
		pkgdatadir=${pkgdatadir}; \
		s=`cat $<`; \
		eval "echo \"$${s}\""; \
	) > $@

install: all
	mkdir -p $(DESTDIR)$(pkgdatadir)/
	mkdir -p $(DESTDIR)$(libexecdir)/
	mkdir -p $(DESTDIR)${pkgdatadir}/../glib-2.0/schemas/
	mkdir -p $(DESTDIR)${pkgdatadir}/../ibus/component/
	mkdir -p $(DESTDIR)${pkgdatadir}/../applications/
	${INSTALL} -m 755 main-gjs.js $(DESTDIR)${pkgdatadir}/main-gjs.js
	${INSTALL} -m 755 pref.js $(DESTDIR)${pkgdatadir}/pref.js
	mkdir -p $(DESTDIR)${pkgdatadir}/src
	cp -r src/* $(DESTDIR)${pkgdatadir}/src/
	${INSTALL} -m 644 src/ui/assets/avro-bangla.png $(DESTDIR)${pkgdatadir}/avro-bangla.png
	${INSTALL} -m 644 src/ui/avropref.ui $(DESTDIR)${pkgdatadir}/avropref.ui
	${INSTALL} -m 644 ibus-avro.xml $(DESTDIR)${pkgdatadir}/../ibus/component/ibus-avro.xml
	${INSTALL} -m 644 com.omicronlab.avro.gschema.xml $(DESTDIR)${pkgdatadir}/../glib-2.0/schemas/com.omicronlab.avro.gschema.xml
	glib-compile-schemas $(DESTDIR)${pkgdatadir}/../glib-2.0/schemas/
	${INSTALL} -m 644 ibus-setup-ibus-avro.desktop $(DESTDIR)${pkgdatadir}/../applications/ibus-setup-ibus-avro.desktop

installdeb: all
	mkdir -p $(DESTDIR)$(pkgdatadir)/
	mkdir -p $(DESTDIR)$(libexecdir)/
	mkdir -p $(DESTDIR)${pkgdatadir}/../glib-2.0/schemas/
	mkdir -p $(DESTDIR)${pkgdatadir}/../ibus/component/	
	mkdir -p $(DESTDIR)${pkgdatadir}/../metainfo/
	mkdir -p $(DESTDIR)${pkgdatadir}/../applications/
	${INSTALL} -m 755 main-gjs.js $(DESTDIR)${pkgdatadir}/main-gjs.js
	${INSTALL} -m 755 pref.js $(DESTDIR)${pkgdatadir}/pref.js
	mkdir -p $(DESTDIR)${pkgdatadir}/src
	cp -r src/* $(DESTDIR)${pkgdatadir}/src/
	${INSTALL} -m 644 src/ui/assets/avro-bangla.png $(DESTDIR)${pkgdatadir}/avro-bangla.png
	${INSTALL} -m 644 src/ui/avropref.ui $(DESTDIR)${pkgdatadir}/avropref.ui
	${INSTALL} -m 644 ibus-avro.xml $(DESTDIR)${pkgdatadir}/../ibus/component/ibus-avro.xml
	${INSTALL} -m 644 com.omicronlab.avro.gschema.xml $(DESTDIR)${pkgdatadir}/../glib-2.0/schemas/com.omicronlab.avro.gschema.xml
	${INSTALL} -m 644 com.github.sarim.ibus.avro.metainfo.xml $(DESTDIR)${pkgdatadir}/../metainfo/com.github.sarim.ibus.avro.metainfo.xml
	${INSTALL} -m 644 ibus-setup-ibus-avro.desktop $(DESTDIR)${pkgdatadir}/../applications/ibus-setup-ibus-avro.desktop

uninstall: 
	rm ${pkgdatadir}/../ibus/component/ibus-avro.xml
	rm ${pkgdatadir}/../glib-2.0/schemas/com.omicronlab.avro.gschema.xml
	rm ${pkgdatadir}/../applications/ibus-setup-ibus-avro.desktop
	glib-compile-schemas ${pkgdatadir}/../glib-2.0/schemas/
	rm -rf ${pkgdatadir}

clean:
	@:
cleanup:
	rm -r evars.js ibus-avro.xml ibus-setup-ibus-avro.desktop Makefile autom4te.cache/ aclocal.m4 config.log config.status configure Makefile.in install-sh missing
.PHONY: all build clean
