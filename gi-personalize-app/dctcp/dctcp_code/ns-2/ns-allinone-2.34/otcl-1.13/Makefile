
#
# try ./configure first to fill in all the definitions corresponding
# to your system, but you always can edit the sections below manually.
#

CC=		gcc
CFLAGS=		-g -O2
RANLIB= 	ranlib
INSTALL=	/usr/bin/install -c

#
# how to compile, link, and name shared libraries
#

SHLIB_LD=	
SHLIB_CFLAGS=	-fpic
SHLIB_SUFFIX=	.so
SHLD_FLAGS=	
DL_LIBS=	-ldl

SHLIB_LD_LIBS  = @SHLIB_LD_LIBS@

#
# where to install shells, libraries, and includes
#

INST_OTCLSH=	/usr/local/bin
INST_OWISH=	/usr/local/bin
INST_OLIB=	/usr/local/lib
INST_OLIBSH=	NONE/lib
INST_OINC=	/usr/local/include


#
# ------------ you shouldn't need to configure below here -----------------
#

INCLUDES = \
	-I. \
	-I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include \
	 \
	-I${prefix}/include \
	

DEFINES = \
	 -DNDEBUG -DUSE_SHM

LIB =	-L/root/dctcp-ns2/ns-2/ns-allinone-2.34/lib -ltk8.4 -L/root/dctcp-ns2/ns-2/ns-allinone-2.34/lib -ltcl8.4 \
	-lXext -lX11  -lnsl -ldl -lm

OTCLLIB= -L. -lotcl

CP= cp -f
RM= rm -f
MV= mv -f

CFILES = otcl.c otclAppInit.c otkAppInit.c

.c.o:
	$(CC) -c $(CFLAGS) $(DEFINES) $(INCLUDES) $<

all: libotcl.a libotcl$(SHLIB_SUFFIX) otclsh owish

#
# compile an appinit with tcl and otcl and link against
# libotcl.a plus required tcl libs to give a standalone binary
#

otclsh: otclAppInit.c libotcl.a
	rm -f libotcl$(SHLIB_SUFFIX)
	$(CC) -o otclsh $(SHLD_FLAGS) $(CFLAGS) $(INCLUDES) otclAppInit.c \
	$(OTCLLIB) $(LIB)

#
# compile an appinit with tcl/tk and otcl and link against
# libotcl.a plus required tcl/tk libs to give a standalone binary
#

owish: otkAppInit.c libotcl.a
	rm -f libotcl$(SHLIB_SUFFIX)
	$(CC) -o owish $(SHLD_FLAGS) $(CFLAGS) $(INCLUDES) otkAppInit.c \
	$(OTCLLIB) $(LIB)

#
# compile otcl.c and link it into a library archive
# INCLUDES give a path to tclInt.h (plus tk and X11)
#

libotcl.a: otcl.c
	rm -f libotcl.a otcl.o
	$(CC) -c $(CFLAGS) $(DEFINES) $(INCLUDES) otcl.c
	ar cq libotcl.a otcl.o
	$(RANLIB) libotcl.a

#
# compile otcl.c and link it into a shared object
# INCLUDES give a path to tclInt.h (plus tk and X11)
#

libotcl$(SHLIB_SUFFIX): otcl.c
	rm -f libotcl$(SHLIB_SUFFIX) otcl.o so_locations
	$(CC) -c $(CFLAGS) $(DEFINES) $(SHLIB_CFLAGS) $(INCLUDES) otcl.c
	$(SHLIB_LD) -o libotcl$(SHLIB_SUFFIX) otcl.o

test: otclsh owish
	./otclsh lib/test.tcl
	./owish lib/test.tcl

dirs:
	for d in $(INST_OWISH) $(INST_OTCLSH) $(INST_OLIB) $(INST_OLIBSH) $(INST_OINC); do \
		if [ ! -d $$d ]; then \
			mkdir -p $$d ;\
		fi;\
	done

install: owish otclsh libotcl.a libotcl$(SHLIB_SUFFIX) otcl.h dirs
	$(INSTALL) owish $(INST_OWISH)
	$(INSTALL) otclsh $(INST_OTCLSH)
	$(INSTALL) libotcl.a $(INST_OLIB)
	$(RANLIB)  $(INST_OLIB)/libotcl.a
	$(INSTALL) libotcl$(SHLIB_SUFFIX) $(INST_OLIBSH)
	$(INSTALL) -m 644 otcl.h $(INST_OINC)

clean:
	rm -f owish otclsh libotcl.a libotcl$(SHLIB_SUFFIX) \
	otcl.o otkAppInit.o otclAppInit.o \
	config.status config.log config.cache \
	core so_locations *.core Makefile

# To be compatible with ns/nam
distclean: clean

binclean:
	rm -f otcl.o otkAppInit.o otclAppInit.o \
	config.status config.log config.cache \
	core so_locations

srctar:
	@cwd=`pwd` ; dir=`basename $$cwd` ; \
	    name=otcl-`cat VERSION | tr A-Z a-z` ; \
	    tar=otcl-src-`cat VERSION`.tar.gz ; \
	    list="" ; \
	    for i in `cat FILES` ; do list="$$list $$name/$$i" ; done; \
	    echo \
	    "(rm -f $$tar; cd .. ; ln -s $$dir $$name)" ; \
	     (rm -f $$tar; cd .. ; ln -s $$dir $$name) ; \
	    echo \
	    "(cd .. ; tar cfh $$tar [lots of files])" ; \
	     (cd .. ; tar cfhz - $$list) > $$tar ; \
	    echo \
	    "rm ../$$name; chmod 444 $$tar" ;  \
	     rm ../$$name; chmod 444 $$tar

depend: $(CFILES)
	@echo Making dependencies for $(srcdir){$(CFILES)}
	@$(CC) -MM $(CFLAGS) $(INCLUDES) $(DEFINES) $(CFILES) > makedep
	@echo '/^# DO NOT DELETE THIS LINE/+1,$$d' > eddep
	@echo '$$r makedep' >> eddep
	@echo 'w' >>eddep
	@$(CP) Makefile Makefile.bak
	@ed - Makefile < eddep
	@$(RM) eddep makedep
	@echo '# DEPENDENCIES MUST END AT END OF FILE' >> Makefile
	@echo '# IF YOU PUT STUFF HERE IT WILL GO AWAY' >> Makefile
	@echo '# see make depend above' >> Makefile

# DO NOT DELETE THIS LINE
# DEPENDENCIES MUST END AT END OF FILE
# IF YOU PUT STUFF HERE IT WILL GO AWAY
# see make depend above
