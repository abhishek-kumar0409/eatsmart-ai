# This Makefile is used to create several test cases for Tcl's load
# command.  It also illustrates how to take advantage of configuration
# exported by Tcl to set up Makefiles for shared libraries.
# RCS: @(#) $Id: Makefile.in,v 1.11.2.2 2004/09/23 20:04:07 mdejong Exp $

TCL_DBGX =		
CC = gcc
LIBS =			-L/root/dctcp-ns2/ns-2/ns-allinone-2.34/tcl8.4.18/unix -ltclstub8.4${TCL_DBGX} -ldl  -lieee -lm
AC_FLAGS =		-DPACKAGE_NAME=\"\" -DPACKAGE_TARNAME=\"\" -DPACKAGE_VERSION=\"\" -DPACKAGE_STRING=\"\" -DPACKAGE_BUGREPORT=\"\" -DPACKAGE_URL=\"\" -DSTDC_HEADERS=1 -DHAVE_SYS_TYPES_H=1 -DHAVE_SYS_STAT_H=1 -DHAVE_STDLIB_H=1 -DHAVE_STRING_H=1 -DHAVE_MEMORY_H=1 -DHAVE_STRINGS_H=1 -DHAVE_INTTYPES_H=1 -DHAVE_STDINT_H=1 -DHAVE_UNISTD_H=1 -DHAVE_LIMITS_H=1 -DHAVE_UNISTD_H=1 -DHAVE_SYS_PARAM_H=1 -DSTATIC_BUILD=1 -DPEEK_XCLOSEIM=1 -D_LARGEFILE64_SOURCE=1 -DTCL_WIDE_INT_IS_LONG=1 -DHAVE_GETCWD=1 -DHAVE_OPENDIR=1 -DHAVE_STRSTR=1 -DHAVE_STRTOL=1 -DHAVE_STRTOLL=1 -DHAVE_STRTOULL=1 -DHAVE_TMPNAM=1 -DHAVE_WAITPID=1 -DUSE_TERMIOS=1 -DHAVE_SYS_TIME_H=1 -DTIME_WITH_SYS_TIME=1 -DHAVE_STRUCT_TM_TM_ZONE=1 -DHAVE_TM_ZONE=1 -DHAVE_GMTIME_R=1 -DHAVE_LOCALTIME_R=1 -DHAVE_TM_GMTOFF=1 -DHAVE_TIMEZONE_VAR=1 -DHAVE_STRUCT_STAT_ST_BLKSIZE=1 -DHAVE_ST_BLKSIZE=1 -DHAVE_SIGNED_CHAR=1 -DHAVE_LANGINFO=1 -DHAVE_FTS=1 -DHAVE_SYS_IOCTL_H=1
SHLIB_CFLAGS =		-fPIC
SHLIB_LD =		${CC} -shared ${CFLAGS} ${LDFLAGS}
SHLIB_LD_LIBS =		${LIBS}
SHLIB_SUFFIX =		.so
SRC_DIR =		/root/dctcp-ns2/ns-2/ns-allinone-2.34/tcl8.4.18/unix/dltest
TCL_VERSION=		8.4

CFLAGS_DEBUG		= -g
CFLAGS_OPTIMIZE		= -O2

CFLAGS =  -pipe  $(CFLAGS_OPTIMIZE)
CC_SWITCHES = $(CFLAGS) -I${SRC_DIR}/../../generic -DTCL_MEM_DEBUG \
	${SHLIB_CFLAGS} -DUSE_TCL_STUBS ${AC_FLAGS}

all: pkga${SHLIB_SUFFIX} pkgb${SHLIB_SUFFIX} pkgc${SHLIB_SUFFIX} pkgd${SHLIB_SUFFIX} pkge${SHLIB_SUFFIX}
	@touch ../dltest.marker

pkga${SHLIB_SUFFIX}: $(SRC_DIR)/pkga.c
	$(CC) -c $(CC_SWITCHES) $(SRC_DIR)/pkga.c
	${SHLIB_LD} -o pkga${SHLIB_SUFFIX} pkga.o ${SHLIB_LD_LIBS}

pkgb${SHLIB_SUFFIX}: $(SRC_DIR)/pkgb.c
	$(CC) -c $(CC_SWITCHES) $(SRC_DIR)/pkgb.c
	${SHLIB_LD} -o pkgb${SHLIB_SUFFIX} pkgb.o ${SHLIB_LD_LIBS}

pkgc${SHLIB_SUFFIX}: $(SRC_DIR)/pkgc.c
	$(CC) -c $(CC_SWITCHES) $(SRC_DIR)/pkgc.c
	${SHLIB_LD} -o pkgc${SHLIB_SUFFIX} pkgc.o ${SHLIB_LD_LIBS}

pkgd${SHLIB_SUFFIX}: $(SRC_DIR)/pkgd.c
	$(CC) -c $(CC_SWITCHES) $(SRC_DIR)/pkgd.c
	${SHLIB_LD} -o pkgd${SHLIB_SUFFIX} pkgd.o ${SHLIB_LD_LIBS}

pkge${SHLIB_SUFFIX}: $(SRC_DIR)/pkge.c
	$(CC) -c $(CC_SWITCHES) $(SRC_DIR)/pkge.c
	${SHLIB_LD} -o pkge${SHLIB_SUFFIX} pkge.o ${SHLIB_LD_LIBS}

clean:
	rm -f *.o config.cache config.log config.status
	rm -f lib.exp ../dltest.marker
	@if test "$(SHLIB_SUFFIX)" != ""; then \
	    echo "rm -f *${SHLIB_SUFFIX}" ; \
	    rm -f *${SHLIB_SUFFIX} ; \
	fi

distclean: clean
	rm -f Makefile
