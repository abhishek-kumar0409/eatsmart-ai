# 
#  Copyright (c) 1999 by the University of Southern California
#  All rights reserved.
# 
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License,
#  version 2, as published by the Free Software Foundation.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License along
#  with this program; if not, write to the Free Software Foundation, Inc.,
#  59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
#
#  The copyright of this module includes the following
#  linking-with-specific-other-licenses addition:
#
#  In addition, as a special exception, the copyright holders of
#  this module give you permission to combine (via static or
#  dynamic linking) this module with free software programs or
#  libraries that are released under the GNU LGPL and with code
#  included in the standard release of ns-2 under the Apache 2.0
#  license or under otherwise-compatible licenses with advertising
#  requirements (or modified versions of such code, with unchanged
#  license).  You may copy and distribute such a system following the
#  terms of the GNU GPL for this module and the licenses of the
#  other code concerned, provided that you include the source code of
#  that other code when and as the GNU GPL requires distribution of
#  source code.
#
#  Note that people who make modified versions of this module
#  are not obligated to grant this special exception for their
#  modified versions; it is their choice whether to do so.  The GNU
#  General Public License gives permission to release a modified
#  version without this exception; this exception also makes it
#  possible to release a modified version which carries forward this
#  exception.
#
# $Header: /cvsroot/nsnam/ns-2/indep-utils/webtrace-conv/epa/Makefile.in,v 1.6 2005/09/16 03:05:40 tomh Exp $

# Top level hierarchy
prefix  = /usr/local
# Pathname of directory to install the binary
BINDEST = /usr/local/bin

CC = g++
MKDEP	= ../../../conf/mkdep

INCLUDE = -I. -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/tclcl-1.19 -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/otcl-1.13 -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include -I/usr/include/pcap
CFLAGS =  -Wall -Wno-write-strings -DCPP_NAMESPACE=std
LDFLAGS = 
LIBS = -L/root/dctcp-ns2/ns-2/ns-allinone-2.34/lib -ltcl8.4  -lnsl -ldl -lm 
INSTALL = /usr/bin/install -c

SRC = tr-stat.cc
OBJ = $(SRC:.cc=.o)

all: epa-tr-stat

epa-tr-stat: $(OBJ)
	$(CC) -o $@ $(LDFLAGS) $(CFLAGS) $(INCLUDE) $(OBJ) $(LIBS)

install: epa-tr-stat
	$(INSTALL) -m 555 -o bin -g bin epa-tr-stat $(DESTDIR)$(BINDEST)

.SUFFIXES: .cc

.cc.o: 
	@rm -f $@
	$(CC) -c $(CFLAGS) $(INCLUDE) -o $@ $*.cc

clean: 
	@rm -f *~ *.o epa-tr-stat *core

depend: $(SRC)
	$(MKDEP) $(CFLAGS) $(INCLUDE) $(SRC)
