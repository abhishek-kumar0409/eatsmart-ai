#  Copyright (c) 1994, 1995, 1996
# 	The Regents of the University of California.  All rights reserved.
#
#  Redistribution and use in source and binary forms, with or without
#  modification, are permitted provided that: (1) source code distributions
#  retain the above copyright notice and this paragraph in its entirety, (2)
#  distributions including binary code include the above copyright notice and
#  this paragraph in its entirety in the documentation or other materials
#  provided with the distribution, and (3) all advertising materials mentioning
#  features or use of this software display the following acknowledgement:
#  ``This product includes software developed by the University of California,
#  Lawrence Berkeley Laboratory and its contributors.'' Neither the name of
#  the University nor the names of its contributors may be used to endorse
#  or promote products derived from this software without specific prior
#  written permission.
#  THIS SOFTWARE IS PROVIDED ``AS IS'' AND WITHOUT ANY EXPRESS OR IMPLIED
#  WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
#  MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
#
# @(#) $Header: 2002/10/09 15:34:11

#
# Various configurable paths (remember to edit Makefile.in, not Makefile)
#

# Top level hierarchy
prefix	= /usr/local
# Pathname of directory to install the binary
BINDEST	= /usr/local/bin
# Pathname of directory to install the man page
MANDEST	= /usr/local/man

BLANK	= # make a blank space.  DO NOT add anything to this line

# The following will be redefined under Windows (see WIN32 lable below)
CC	= gcc
CPP	= g++
LINK	= $(CPP)
LINK_SHLIB = gcc -shared
MKDEP	= ./conf/mkdep
TCLSH	= /root/dctcp-ns2/ns-2/ns-allinone-2.34/bin/tclsh8.4
TCL2C	= ../tclcl-1.19/tcl2c++
AR	= ar rc $(BLANK)

RANLIB	= ranlib
INSTALL	= /usr/bin/install -c
LN	= ln
TEST	= test
RM	= rm -f
MV      = mv
PERL	= /usr/bin/perl

# for diffusion
#DIFF_INCLUDES = "./diffusion3/main ./diffusion3/lib ./diffusion3/nr ./diffusion3/ns"

CCOPT	=  -Wall -Wno-write-strings 
STATIC	= 
#LDFLAGS	= $(STATIC)
LDFLAGS	=  -Wl,-export-dynamic 
LDOUT	= -o $(BLANK)

DEFINE	= -DTCP_DELAY_BIND_ALL -DNO_TK -DTCLCL_CLASSINSTVAR  -DNDEBUG -DLINUX_TCP_HEADER -DUSE_SHM -DHAVE_LIBTCLCL -DHAVE_TCLCL_H -DHAVE_LIBOTCL1_13 -DHAVE_OTCL_H -DHAVE_LIBTK8_4 -DHAVE_TK_H -DHAVE_LIBTCL8_4 -DHAVE_TCLINT_H -DHAVE_TCL_H  -DHAVE_CONFIG_H -DNS_DIFFUSION -DSMAC_NO_SYNC -DCPP_NAMESPACE=std -DUSE_SINGLE_ADDRESS_SPACE -Drng_test

INCLUDES = \
	-I.  \
	-I. \
	-I/root/dctcp-ns2/ns-2/ns-allinone-2.34/tclcl-1.19 -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/otcl-1.13 -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include -I/root/dctcp-ns2/ns-2/ns-allinone-2.34/include -I/usr/include/pcap \
	-I./tcp -I./sctp -I./common -I./link -I./queue \
	-I./adc -I./apps -I./mac -I./mobile -I./trace \
	-I./routing -I./tools -I./classifier -I./mcast \
	-I./diffusion3/lib/main -I./diffusion3/lib \
	-I./diffusion3/lib/nr -I./diffusion3/ns \
	-I./diffusion3/filter_core -I./asim/ -I./qs \
	-I./diffserv -I./satellite \
	-I./wpan


LIB	= \
	-L/root/dctcp-ns2/ns-2/ns-allinone-2.34/tclcl-1.19 -ltclcl -L/root/dctcp-ns2/ns-2/ns-allinone-2.34/otcl-1.13 -lotcl -L/root/dctcp-ns2/ns-2/ns-allinone-2.34/lib -ltk8.4 -L/root/dctcp-ns2/ns-2/ns-allinone-2.34/lib -ltcl8.4 \
	-lXext -lX11 \
	 -lnsl -ldl \
	-lm -lm 
#	-L${exec_prefix}/lib \

CFLAGS	+= $(CCOPT) $(DEFINE) 

# Explicitly define compilation rules since SunOS 4's make doesn't like gcc.
# Also, gcc does not remove the .o before forking 'as', which can be a
# problem if you don't own the file but can write to the directory.
.SUFFIXES: .cc	# $(.SUFFIXES)

.cc.o:
	@rm -f $@
	$(CPP) -c $(CFLAGS) $(INCLUDES) -o $@ $*.cc

.c.o:
	@rm -f $@
	$(CC) -c $(CFLAGS) $(INCLUDES) -o $@ $*.c


GEN_DIR	= gen/
LIB_DIR	= lib/
NS	= ns
NSLIB   = libns.so
NSX	= nsx
NSE	= nse
NSTK = nstk

# To allow conf/makefile.win overwrite this macro
# We will set these two macros to empty in conf/makefile.win since VC6.0
# does not seem to support the STL in gcc 2.8 and up. 
OBJ_STL = diffusion3/lib/nr/nr.o diffusion3/lib/dr.o \
	diffusion3/filters/diffusion/one_phase_pull.o \
	diffusion3/filters/diffusion/two_phase_pull.o \
	diffusion3/lib/diffapp.o \
	diffusion3/ns/diffagent.o diffusion3/ns/diffrtg.o \
	diffusion3/ns/difftimer.o \
	diffusion3/filter_core/filter_core.o \
	diffusion3/filter_core/iolog.o \
	diffusion3/filter_core/iostats.o \
	diffusion3/lib/main/attrs.o \
	diffusion3/lib/main/events.o \
	diffusion3/lib/main/iodev.o \
	diffusion3/lib/main/iohook.o \
	diffusion3/lib/main/timers.o \
	diffusion3/lib/main/message.o \
	diffusion3/lib/main/tools.o \
	diffusion3/apps/gear_examples/gear_common.o \
	diffusion3/apps/gear_examples/gear_receiver.o \
	diffusion3/apps/gear_examples/gear_sender.o \
	diffusion3/apps/rmst_examples/rmst_sink.o \
	diffusion3/apps/rmst_examples/rmst_source.o \
	diffusion3/apps/ping/1pp_ping_sender.o \
	diffusion3/apps/ping/1pp_ping_receiver.o \
	diffusion3/apps/ping/2pp_ping_sender.o \
	diffusion3/apps/ping/2pp_ping_receiver.o \
	diffusion3/apps/ping/ping_common.o \
	diffusion3/apps/ping/push_receiver.o \
	diffusion3/apps/ping/push_sender.o \
	diffusion3/filters/gear/gear_attr.o \
	diffusion3/filters/gear/gear.o \
	diffusion3/filters/gear/gear_tools.o \
	diffusion3/filters/misc/log.o \
	diffusion3/filters/misc/srcrt.o \
	diffusion3/filters/misc/tag.o \
	diffusion3/filters/rmst/rmst.o \
	diffusion3/filters/rmst/rmst_filter.o \
	delaybox/delaybox.o \
	packmime/packmime_HTTP.o packmime/packmime_HTTP_rng.o \
	packmime/packmime_OL.o packmime/packmime_OL_ranvar.o\
	packmime/packmime_ranvar.o \
	tmix/tmix.o tmix/tmix_delaybox.o

NS_TCL_LIB_STL = tcl/lib/ns-diffusion.tcl \
	tcl/delaybox/delaybox.tcl \
	tcl/packmime/packmime.tcl \
	tcl/tmix/tmix.tcl \
	tcl/tmix/tmix_delaybox.tcl


# WIN32: uncomment the following line to include specific make for VC++
# !include <conf/makefile.win>

OBJ_CC = \
	tools/random.o tools/rng.o tools/ranvar.o common/misc.o common/timer-handler.o \
	common/scheduler.o common/object.o common/packet.o \
	common/ip.o routing/route.o common/connector.o common/ttl.o \
	trace/trace.o trace/trace-ip.o \
	classifier/classifier.o classifier/classifier-addr.o \
	classifier/classifier-hash.o \
	classifier/classifier-virtual.o \
	classifier/classifier-mcast.o \
	classifier/classifier-bst.o \
	classifier/classifier-mpath.o mcast/replicator.o \
	classifier/classifier-mac.o \
	classifier/classifier-qs.o \
	classifier/classifier-port.o src_rtg/classifier-sr.o \
        src_rtg/sragent.o src_rtg/hdr_src.o adc/ump.o \
	qs/qsagent.o qs/hdr_qs.o \
	apps/app.o apps/telnet.o tcp/tcplib-telnet.o \
	tools/trafgen.o trace/traffictrace.o tools/pareto.o \
	tools/expoo.o tools/cbr_traffic.o \
	adc/tbf.o adc/resv.o adc/sa.o tcp/saack.o \
	tools/measuremod.o adc/estimator.o adc/adc.o adc/ms-adc.o \
	adc/timewindow-est.o adc/acto-adc.o \
        adc/pointsample-est.o adc/salink.o adc/actp-adc.o \
	adc/hb-adc.o adc/expavg-est.o\
	adc/param-adc.o adc/null-estimator.o \
	adc/adaptive-receiver.o apps/vatrcvr.o adc/consrcvr.o \
	common/agent.o common/message.o apps/udp.o \
	common/session-rtp.o apps/rtp.o tcp/rtcp.o \
	common/ivs.o \
	common/messpass.o common/tp.o common/tpm.o apps/worm.o \
	tcp/tcp.o tcp/tcp-sink.o tcp/tcp-reno.o \
	tcp/tcp-newreno.o \
	tcp/tcp-vegas.o tcp/tcp-rbp.o tcp/tcp-full.o tcp/rq.o \
	baytcp/tcp-full-bay.o baytcp/ftpc.o baytcp/ftps.o \
	tcp/scoreboard.o tcp/scoreboard-rq.o tcp/tcp-sack1.o tcp/tcp-fack.o \
	tcp/linux/tcp_naivereno.o\
	tcp/linux/src/tcp_cong.o\
	tcp/linux/src/tcp_highspeed.o tcp/linux/src/tcp_bic.o tcp/linux/src/tcp_htcp.o tcp/linux/src/tcp_scalable.o tcp/linux/src/tcp_cubic.o\
	tcp/linux/src/tcp_westwood.o tcp/linux/src/tcp_vegas.o tcp/linux/src/tcp_hybla.o\
	tcp/linux/src/tcp_illinois.o tcp/linux/src/tcp_yeah.o \
	tcp/linux/src/tcp_veno.o tcp/linux/src/tcp_compound.o tcp/linux/src/tcp_lp.o\
	tcp/scoreboard1.o tcp/tcp-linux.o tcp/linux/ns-linux-util.o tcp/linux/ns-linux-c.o tcp/linux/ns-linux-param.o\
	tcp/tcp-asym.o tcp/tcp-asym-sink.o tcp/tcp-fs.o \
	tcp/tcp-asym-fs.o \
	tcp/tcp-int.o tcp/chost.o tcp/tcp-session.o \
	tcp/nilist.o \
	sctp/sctp.o apps/sctp_app1.o\
	sctp/sctp-timestamp.o sctp/sctp-hbAfterRto.o \
	sctp/sctp-multipleFastRtx.o sctp/sctp-mfrHbAfterRto.o \
	sctp/sctp-mfrTimestamp.o \
	sctp/sctp-cmt.o \
	sctp/sctpDebug.o \
	tools/integrator.o tools/queue-monitor.o \
	tools/flowmon.o tools/loss-monitor.o \
	queue/queue.o queue/drop-tail.o \
	adc/simple-intserv-sched.o queue/red.o \
	queue/semantic-packetqueue.o queue/semantic-red.o \
	tcp/ack-recons.o \
	queue/sfq.o queue/fq.o queue/drr.o queue/srr.o queue/cbq.o \
	queue/jobs.o queue/marker.o queue/demarker.o \
	link/hackloss.o queue/errmodel.o queue/fec.o\
	link/delay.o tcp/snoop.o \
	gaf/gaf.o \
	link/dynalink.o routing/rtProtoDV.o common/net-interface.o \
	mcast/ctrMcast.o mcast/mcast_ctrl.o mcast/srm.o \
	common/sessionhelper.o queue/delaymodel.o \
	mcast/srm-ssm.o mcast/srm-topo.o \
	routing/alloc-address.o routing/address.o \
	$(LIB_DIR)int.Vec.o $(LIB_DIR)int.RVec.o \
	$(LIB_DIR)dmalloc_support.o \
	webcache/http.o webcache/tcp-simple.o webcache/pagepool.o \
	webcache/inval-agent.o webcache/tcpapp.o webcache/http-aux.o \
	webcache/mcache.o webcache/webtraf.o \
	webcache/webserver.o \
	webcache/logweb.o \
	empweb/empweb.o \
	empweb/empftp.o \
	realaudio/realaudio.o \
	mac/lanRouter.o classifier/filter.o \
	common/pkt-counter.o \
	common/Decapsulator.o common/Encapsulator.o \
	common/encap.o \
	mac/channel.o mac/mac.o mac/ll.o mac/mac-802_11.o \
	mac/mac-802_11Ext.o \
	mac/mac-802_3.o mac/mac-tdma.o mac/smac.o \
	mobile/mip.o mobile/mip-reg.o mobile/gridkeeper.o \
	mobile/propagation.o mobile/tworayground.o \
	mobile/nakagami.o \
	mobile/antenna.o mobile/omni-antenna.o \
	mobile/shadowing.o mobile/shadowing-vis.o mobile/dumb-agent.o \
	common/bi-connector.o common/node.o \
	common/mobilenode.o \
	mac/arp.o mobile/god.o mobile/dem.o \
	mobile/topography.o mobile/modulation.o \
	queue/priqueue.o queue/dsr-priqueue.o \
	mac/phy.o mac/wired-phy.o mac/wireless-phy.o \
	mac/wireless-phyExt.o \
	mac/mac-timers.o trace/cmu-trace.o mac/varp.o \
	mac/mac-simple.o \
	satellite/sat-hdlc.o \
	dsdv/dsdv.o dsdv/rtable.o queue/rtqueue.o \
	routing/rttable.o \
	imep/imep.o imep/dest_queue.o imep/imep_api.o \
	imep/imep_rt.o imep/rxmit_queue.o imep/imep_timers.o \
	imep/imep_util.o imep/imep_io.o \
	tora/tora.o tora/tora_api.o tora/tora_dest.o \
	tora/tora_io.o tora/tora_logs.o tora/tora_neighbor.o \
	dsr/dsragent.o dsr/hdr_sr.o dsr/mobicache.o dsr/path.o \
	dsr/requesttable.o dsr/routecache.o dsr/add_sr.o \
	dsr/dsr_proto.o dsr/flowstruct.o dsr/linkcache.o \
	dsr/simplecache.o dsr/sr_forwarder.o \
	aodv/aodv_logs.o aodv/aodv.o \
	aodv/aodv_rtable.o aodv/aodv_rqueue.o \
	aomdv/aomdv_logs.o aomdv/aomdv.o \
	aomdv/aomdv_rtable.o aomdv/aomdv_rqueue.o \
	common/ns-process.o \
	satellite/satgeometry.o satellite/sathandoff.o \
	satellite/satlink.o satellite/satnode.o \
	satellite/satposition.o satellite/satroute.o \
	satellite/sattrace.o \
	rap/raplist.o rap/rap.o rap/media-app.o rap/utilities.o \
	common/fsm.o tcp/tcp-abs.o \
	diffusion/diffusion.o diffusion/diff_rate.o diffusion/diff_prob.o \
	diffusion/diff_sink.o diffusion/flooding.o diffusion/omni_mcast.o \
	diffusion/hash_table.o diffusion/routing_table.o diffusion/iflist.o \
	tcp/tfrc.o tcp/tfrc-sink.o mobile/energy-model.o apps/ping.o tcp/tcp-rfc793edu.o \
	queue/rio.o queue/semantic-rio.o tcp/tcp-sack-rh.o tcp/scoreboard-rh.o \
	plm/loss-monitor-plm.o plm/cbr-traffic-PP.o \
	linkstate/hdr-ls.o \
	mpls/classifier-addr-mpls.o mpls/ldp.o mpls/mpls-module.o \
	routing/rtmodule.o classifier/classifier-hier.o \
	routing/addr-params.o \
         nix/hdr_nv.o nix/classifier-nix.o \
         nix/nixnode.o \
         routealgo/rnode.o \
         routealgo/bfs.o \
         routealgo/rbitmap.o \
         routealgo/rlookup.o \
         routealgo/routealgo.o \
         nix/nixvec.o \
	nix/nixroute.o \
	diffserv/dsred.o diffserv/dsredq.o \
	diffserv/dsEdge.o diffserv/dsCore.o \
	diffserv/dsPolicy.o diffserv/ew.o diffserv/dewp.o \
	queue/red-pd.o queue/pi.o queue/vq.o queue/rem.o \
	queue/gk.o \
	pushback/rate-limit.o pushback/rate-limit-strategy.o \
	pushback/ident-tree.o pushback/agg-spec.o \
	pushback/logging-data-struct.o \
	pushback/rate-estimator.o \
	pushback/pushback-queue.o pushback/pushback.o \
	common/parentnode.o trace/basetrace.o \
	common/simulator.o asim/asim.o \
	common/scheduler-map.o common/splay-scheduler.o \
	linkstate/ls.o linkstate/rtProtoLS.o \
	pgm/classifier-pgm.o pgm/pgm-agent.o pgm/pgm-sender.o \
	pgm/pgm-receiver.o mcast/rcvbuf.o \
	mcast/classifier-lms.o mcast/lms-agent.o mcast/lms-receiver.o \
	mcast/lms-sender.o \
	queue/delayer.o \
	xcp/xcpq.o xcp/xcp.o xcp/xcp-end-sys.o \
	wpan/p802_15_4csmaca.o wpan/p802_15_4fail.o \
	wpan/p802_15_4hlist.o wpan/p802_15_4mac.o \
	wpan/p802_15_4nam.o wpan/p802_15_4phy.o \
	wpan/p802_15_4sscs.o wpan/p802_15_4timer.o \
	wpan/p802_15_4trace.o wpan/p802_15_4transac.o \
	apps/pbc.o \
	$(OBJ_STL)


# don't allow comments to follow continuation lines

#  mac-csma.o mac-multihop.o\
#	sensor-nets/landmark.o mac-simple-wireless.o \
#	sensor-nets/tags.o sensor-nets/sensor-query.o \
#	sensor-nets/flood-agent.o \

# what was here before is now in emulate/
OBJ_C =

OBJ_COMPAT = $(OBJ_GETOPT) common/win32.o
#XXX compat/win32x.o compat/tkConsole.o

OBJ_EMULATE_CC = \
	emulate/net-ip.o \
	emulate/net.o \
	emulate/tap.o \
	emulate/ether.o \
	emulate/internet.o \
	emulate/ping_responder.o \
	emulate/arp.o \
	emulate/icmp.o \
	emulate/net-pcap.o \
	emulate/nat.o  \
	emulate/iptap.o \
	emulate/tcptap.o

OBJ_EMULATE_C = \
	emulate/inet.o

OBJ_GEN = $(GEN_DIR)version.o $(GEN_DIR)ns_tcl.o $(GEN_DIR)ptypes.o

SRC =	$(OBJ_C:.o=.c) $(OBJ_CC:.o=.cc) \
	$(OBJ_EMULATE_C:.o=.c) $(OBJ_EMULATE_CC:.o=.cc) \
	common/tclAppInit.cc common/tkAppInit.cc 

OBJ =	$(OBJ_C) $(OBJ_CC) $(OBJ_GEN) $(OBJ_COMPAT)

CLEANFILES = ns nse nsx ns.dyn $(OBJ) $(OBJ_EMULATE_CC) \
	$(OBJ_EMULATE_C) common/tclAppInit.o \
	common/tkAppInit.o nstk \
	$(GEN_DIR)* $(NS).core core core.$(NS) core.$(NSX) core.$(NSE) \
	common/ptypes2tcl common/ptypes2tcl.o 

SUBDIRS=\
	indep-utils/cmu-scen-gen/setdest \
	indep-utils/webtrace-conv/dec \
	indep-utils/webtrace-conv/epa \
	indep-utils/webtrace-conv/nlanr \
	indep-utils/webtrace-conv/ucb

BUILD_NSE = 

all: $(NS) $(BUILD_NSE) $(NSTK) all-recursive Makefile


all-recursive:
	for i in $(SUBDIRS); do ( cd $$i; $(MAKE) all; ) done




ifeq ($(NSLIB),libns.dll)

# This is for cygwin

NS_CPPFLAGS = -DNSLIBNAME=\"$(NSLIB)\" 
NS_LIBS =  -ldl

$(NSLIB): $(OBJ) common/tclAppInit.o 
	$(LINK) -shared $(LDFLAGS) \
		$(LDOUT)$@  \
		-Wl,--export-all-symbols \
		-Wl,--enable-auto-import \
		-Wl,--out-implib=$@.a \
		-Wl,--whole-archive $^ \
		-Wl,--no-whole-archive  

$(NS): $(NSLIB) common/main-modular.cc 
	$(LINK) $(NS_CPPFLAGS) $(LDFLAGS) $(LDOUT)$@ common/main-modular.cc $(NS_LIBS)

else 

# default for all systems but cygwin

$(NS): $(OBJ) common/tclAppInit.o common/main-monolithic.o
	$(LINK) $(LDFLAGS) $(LDOUT)$@ $^ $(LIB)

endif 



Makefile: Makefile.in
	@echo "Makefile.in is newer than Makefile."
	@echo "You need to re-run configure."
	false

$(NSE): $(OBJ) common/tclAppInit.o common/main-monolithic.o $(OBJ_EMULATE_CC) $(OBJ_EMULATE_C)
	$(LINK) $(LDFLAGS) $(LDOUT)$@ $^ $(LIB) 

$(NSTK): $(OBJ) common/tkAppInit.o 
	$(LINK) $(LDFLAGS) $(LDOUT)$@ $^ $(LIB)

ns.dyn: $(OBJ) common/tclAppInit.o common/main-monolithic.o 
	$(LINK) $(LDFLAGS) -o $@ $^ $(LIB)

PURIFY	= purify -cache-dir=/tmp
ns-pure: $(OBJ) common/tclAppInit.o common/main-monolithic.o 
	$(PURIFY) $(LINK) $(LDFLAGS) -o $@ $^ $(LIB)

NS_TCL_LIB = \
	tcl/lib/ns-compat.tcl \
	tcl/lib/ns-default.tcl \
	tcl/lib/ns-errmodel.tcl \
	tcl/lib/ns-lib.tcl \
	tcl/lib/ns-link.tcl \
	tcl/lib/ns-mobilenode.tcl \
	tcl/lib/ns-sat.tcl \
	tcl/lib/ns-cmutrace.tcl \
	tcl/lib/ns-node.tcl \
	tcl/lib/ns-rtmodule.tcl \
	tcl/lib/ns-hiernode.tcl \
	tcl/lib/ns-packet.tcl \
	tcl/lib/ns-queue.tcl \
	tcl/lib/ns-source.tcl \
	tcl/lib/ns-nam.tcl \
	tcl/lib/ns-trace.tcl \
	tcl/lib/ns-agent.tcl \
	tcl/lib/ns-random.tcl \
	tcl/lib/ns-namsupp.tcl \
	tcl/lib/ns-address.tcl \
	tcl/lib/ns-intserv.tcl \
	tcl/lib/ns-autoconf.tcl \
	tcl/rtp/session-rtp.tcl \
	tcl/lib/ns-mip.tcl \
	tcl/rtglib/dynamics.tcl \
	tcl/rtglib/route-proto.tcl \
	tcl/rtglib/algo-route-proto.tcl \
	tcl/rtglib/ns-rtProtoLS.tcl \
        tcl/interface/ns-iface.tcl \
	tcl/mcast/BST.tcl \
        tcl/mcast/ns-mcast.tcl \
        tcl/mcast/McastProto.tcl \
        tcl/mcast/DM.tcl \
	tcl/mcast/srm.tcl \
	tcl/mcast/srm-adaptive.tcl \
	tcl/mcast/srm-ssm.tcl \
	tcl/mcast/timer.tcl \
	tcl/mcast/McastMonitor.tcl \
	tcl/mobility/dsdv.tcl \
	tcl/mobility/dsr.tcl \
        tcl/ctr-mcast/CtrMcast.tcl \
        tcl/ctr-mcast/CtrMcastComp.tcl \
        tcl/ctr-mcast/CtrRPComp.tcl \
	tcl/rlm/rlm.tcl \
	tcl/rlm/rlm-ns.tcl \
	tcl/session/session.tcl \
	tcl/lib/ns-route.tcl \
	tcl/emulate/ns-emulate.tcl \
	tcl/lan/vlan.tcl \
	tcl/lan/abslan.tcl \
	tcl/lan/ns-ll.tcl \
	tcl/lan/ns-mac.tcl \
	tcl/webcache/http-agent.tcl \
	tcl/webcache/http-server.tcl \
	tcl/webcache/http-cache.tcl \
	tcl/webcache/http-mcache.tcl \
	tcl/webcache/webtraf.tcl \
	tcl/webcache/empweb.tcl \
	tcl/webcache/empftp.tcl \
	tcl/plm/plm.tcl \
	tcl/plm/plm-ns.tcl \
	tcl/plm/plm-topo.tcl \
	tcl/mpls/ns-mpls-classifier.tcl \
	tcl/mpls/ns-mpls-ldpagent.tcl \
	tcl/mpls/ns-mpls-node.tcl \
	tcl/mpls/ns-mpls-simulator.tcl \
	tcl/lib/ns-pushback.tcl \
	tcl/lib/ns-srcrt.tcl \
	tcl/mcast/ns-lms.tcl \
	tcl/lib/ns-qsnode.tcl \
	$(NS_TCL_LIB_STL)

$(GEN_DIR)ns_tcl.cc: $(NS_TCL_LIB)
	$(TCLSH) bin/tcl-expand.tcl tcl/lib/ns-lib.tcl $(NS_TCL_LIB_STL) | $(TCL2C) et_ns_lib > $@

$(GEN_DIR)version.c: VERSION
	$(RM) $@
	$(TCLSH) bin/string2c.tcl version_string < VERSION > $@

$(GEN_DIR)ptypes.cc: common/ptypes2tcl common/packet.h
	./common/ptypes2tcl > $@

common/ptypes2tcl: common/ptypes2tcl.o
	$(LINK) $(LDFLAGS) $(LDOUT)$@ common/ptypes2tcl.o

common/ptypes2tcl.o: common/ptypes2tcl.cc common/packet.h

dirs:
	for d in $(DESTDIR)$(MANDEST)/man1; do \
		if [ ! -d $$d ]; then \
			mkdir -p $$d ;\
		fi;\
	done


install: dirs force install-ns install-man

install-ns: force
	$(INSTALL) -m 755 ns $(DESTDIR)$(BINDEST)

install-man: force
	$(INSTALL) -m 644 ns.1 $(DESTDIR)$(MANDEST)/man1

install-recursive: force
	for i in $(SUBDIRS); do ( cd $$i; $(MAKE) install; ) done

clean:
	$(RM) $(CLEANFILES)

AUTOCONF_GEN = tcl/lib/ns-autoconf.tcl
distclean: distclean-recursive
	$(RM) $(CLEANFILES) Makefile config.cache config.log config.status \
	    autoconf.h gnuc.h os-proto.h $(AUTOCONF_GEN); \
	$(MV) .configure .configure- ;\
	echo "Moved .configure to .configure-"

distclean-recursive:
	for i in $(SUBDIRS); do ( cd $$i; $(MAKE) clean; $(RM) Makefile; ) done

tags:	force
	ctags -wtd *.cc *.h webcache/*.cc webcache/*.h dsdv/*.cc dsdv/*.h \
	dsr/*.cc dsr/*.h webcache/*.cc webcache/*.h lib/*.cc lib/*.h \
	../Tcl/*.cc ../Tcl/*.h 

TAGS:	force
	etags *.cc *.h webcache/*.cc webcache/*.h dsdv/*.cc dsdv/*.h \
	dsr/*.cc dsr/*.h webcache/*.cc webcache/*.h lib/*.cc lib/*.h \
	../Tcl/*.cc ../Tcl/*.h

tcl/lib/TAGS:	force
	( \
		cd tcl/lib; \
		$(TCLSH) ../../bin/tcl-expand.tcl ns-lib.tcl | grep '^### tcl-expand.tcl: begin' | awk '{print $$5}' >.tcl_files; \
		etags --lang=none -r '/^[ \t]*proc[ \t]+\([^ \t]+\)/\1/' `cat .tcl_files`; \
		etags --append --lang=none -r '/^\([A-Z][^ \t]+\)[ \t]+\(instproc\|proc\)[ \t]+\([^ \t]+\)[ \t]+/\1::\3/' `cat .tcl_files`; \
	)

depend: $(SRC)
	$(MKDEP) $(CFLAGS) $(INCLUDES) -- $(SRC) 2>&1 > /dev/null

srctar:
	@cwd=`pwd` ; dir=`basename $$cwd` ; \
	    name=ns-`cat VERSION | tr A-Z a-z` ; \
	    tar=ns-src-`cat VERSION`.tar.gz ; \
	    list="" ; \
	    for i in `cat FILES` ; do list="$$list $$name/$$i" ; done; \
	    echo \
	    "(rm -f $$tar; cd .. ; ln -s $$dir $$name)" ; \
	     (rm -f $$tar; cd .. ; ln -s $$dir $$name) ; \
	    echo \
	    "(cd .. ; tar cfhz $$tar [lots of files])" ; \
	     (cd .. ; tar cfhz - $$list) > $$tar ; \
	    echo \
	    "rm ../$$name; chmod 444 $$tar" ;  \
	     rm ../$$name; chmod 444 $$tar

force:

test:	force
	./validate

# Create makefile.vc for Win32 development by replacing:
# "# !include ..." 	-> 	"!include ..."
makefile.vc:	Makefile.in
	$(PERL) bin/gen-vcmake.pl < Makefile.in > makefile.vc
#	$(PERL) -pe 's/^# (\!include)/\!include/o' < Makefile.in > makefile.vc
