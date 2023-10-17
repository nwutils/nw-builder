{
  'variables': {
    'configuring_node%': 0,
    'asan%': 0,
    'werror': '',                     # Turn off -Werror in V8 build.
    'visibility%': 'hidden',          # V8's visibility setting
    'target_arch%': 'ia32',           # set v8's target architecture
    'host_arch%': 'ia32',             # set v8's host architecture
    'want_separate_host_toolset%': 1, # V8 should not build target and host
    'library%': 'static_library',     # allow override to 'shared_library' for DLL/.so builds
    'component%': 'static_library',   # NB. these names match with what V8 expects
    'msvs_multi_core_compile': '0',   # we do enable multicore compiles, but not using the V8 way
    'enable_pgo_generate%': '0',
    'enable_pgo_use%': '0',
    'python%': 'python3',

    'node_shared%': 'true',
    'force_dynamic_crt%': 0,
    'node_use_v8_platform%': 'true',
    'node_use_bundled_v8%': 'true',
    'node_debug_lib': 'false',
    'node_shared_libuv': 'false',
    'node_module_version%': '',
    'node_with_ltcg%': '',
    'node_shared_openssl%': 'false',

    'build_v8_with_gn': 'false',
    'openssl_no_asm': 1,
    'mac_product_name': 'nwjs',
    'enable_lto': 'false',
    'v8_enable_pointer_compression': 0,
    'v8_enable_31bit_smis_on_64bit_arch': 0,

    'node_tag%': '',
    'uv_library%': 'static_library',

    'clang%': 0,
    'error_on_warn%': 'false',

    'openssl_product': '<(STATIC_LIB_PREFIX)openssl<(STATIC_LIB_SUFFIX)',
    'openssl_fips': '',
    'node_fipsinstall': 'false',
    'experimental_quic': 0,
    'llvm_version': '6.0',

    # Don't use ICU data file (icudtl.dat) from V8, we use our own.
    'icu_use_data_file_flag%': 0,

    # Reset this number to 0 on major V8 upgrades.
    # Increment by one for each non-official patch applied to deps/v8.
    'v8_embedder_string': '-node.10',

    ##### V8 defaults for Node.js #####

    # Turn on SipHash for hash seed generation, addresses HashWick
    'v8_use_siphash': 'true',

    # These are more relevant for V8 internal development.
    # Refs: https://github.com/nodejs/node/issues/23122
    # Refs: https://github.com/nodejs/node/issues/23167
    # Enable compiler warnings when using V8_DEPRECATED apis from V8 code.
    'v8_deprecation_warnings': 0,
    # Enable compiler warnings when using V8_DEPRECATE_SOON apis from V8 code.
    'v8_imminent_deprecation_warnings': 0,

    # Enable disassembler for `--print-code` v8 options
    'v8_enable_disassembler': 1,
    'v8_host_byteorder': '<!(python3 -c "import sys; print(sys.byteorder)")',

    # Sets -dOBJECT_PRINT.
    'v8_enable_object_print%': 1,

    # https://github.com/nodejs/node/pull/22920/files#r222779926
    'v8_enable_handle_zapping': 0,

    # Disable pointer compression. Can be enabled at build time via configure
    # options but default values are required here as this file is also used by
    # node-gyp to build addons.
    'v8_enable_pointer_compression%': 0,
    'v8_enable_31bit_smis_on_64bit_arch%': 0,

    # Disable v8 hugepage by default.
    'v8_enable_hugepage%': 0,

    'v8_use_external_startup_data': 1,
    'v8_enable_i18n_support%': 1,
    #'icu_use_data_file_flag%': 1,
    'win_fastlink': 0,

    # This is more of a V8 dev setting
    # https://github.com/nodejs/node/pull/22920/files#r222779926
    'v8_enable_fast_mksnapshot': 0,

    'v8_win64_unwinding_info': 1,

    # TODO(refack): make v8-perfetto happen
    'v8_use_perfetto': 0,

    ##### end V8 defaults #####
    'variables': {
      'building_nw%' : 0,
    },
    'building_nw%' : '<(building_nw)',

    'conditions': [
      ['OS == "win"', {
        'os_posix': 0,
        'v8_postmortem_support%': 0,
        'obj_dir': '<(PRODUCT_DIR)/obj',
        #'v8_base': '<(PRODUCT_DIR)/lib/libv8_snapshot.a',
        'clang_dir': 'third_party/llvm-build/Release+Asserts/',
      }, {
        'os_posix': 1,
        'v8_postmortem_support%': 1,
        'clang_dir': '<!(cd <(DEPTH) && pwd -P)/third_party/llvm-build/Release+Asserts',
      }],
      ['GENERATOR == "ninja"', {
        'obj_dir': '<(PRODUCT_DIR)/obj',
        #'v8_base': '<(PRODUCT_DIR)/obj/tools/v8_gypfiles/libv8_snapshot.a',
      }, {
        'obj_dir%': '<(PRODUCT_DIR)/obj.target',
        #'v8_base': '<(PRODUCT_DIR)/obj.target/tools/v8_gypfiles/libv8_snapshot.a',
      }],
      ['target_arch=="x64" or target_arch=="arm64"', {
        'v8_enable_pointer_compression': 1,
        'v8_enable_31bit_smis_on_64bit_arch': 1,
      }],
      ['OS=="linux" and target_arch=="ia32" and <(building_nw)==1', {
        'sysroot': '<!(cd <(DEPTH) && pwd -P)/build/linux/debian_sid_i386-sysroot',
      }],
      ['OS=="linux" and target_arch=="x64" and <(building_nw)==1', {
        'sysroot': '<!(cd <(DEPTH) && pwd -P)/build/linux/debian_sid_amd64-sysroot',
      }],
      ['OS=="linux" and target_arch=="arm" and <(building_nw)==1', {
        'sysroot': '<!(cd <(DEPTH) && pwd -P)/build/linux/debian_sid_arm-sysroot',
      }],
      ['OS=="mac"', {
        'clang%': 1,
        'obj_dir%': '<(PRODUCT_DIR)/obj.target',
        #'v8_base': '<(PRODUCT_DIR)/libv8_snapshot.a',
      }],
      # V8 pointer compression only supports 64bit architectures.
      ['target_arch in "arm ia32 mips mipsel ppc"', {
        'v8_enable_pointer_compression': 0,
        'v8_enable_31bit_smis_on_64bit_arch': 0,
      }],
      ['target_arch in "ppc64 s390x"', {
        'v8_enable_backtrace': 1,
      }],
      ['OS=="linux"', {
        'node_section_ordering_info%': ''
      }],
      ['OS == "zos"', {
        # use ICU data file on z/OS
        'icu_use_data_file_flag%': 1
      }]
    ],
  },

  'conditions': [
      [ 'clang==1 and OS == "linux" and building_nw==1', {
        'make_global_settings': [
          ['CC', '<(clang_dir)/bin/clang'],
          ['CXX', '<(clang_dir)/bin/clang++'],
          ['CC.host', '$(CC)'],
          ['CXX.host', '$(CXX)'],
        ],
      }],
      [ 'clang==1 and OS == "win" and building_nw==1', {
        'make_global_settings': [
          ['CC', 'third_party/llvm-build/Release+Asserts/bin/clang-cl'],
          ['CXX', 'third_party/llvm-build/Release+Asserts/bin/clang-cl'],
          ['CC.host', '$(CC)'],
          ['CXX.host', '$(CXX)'],
        ],
      }],
      [ 'OS == "win" and building_nw==1', {
        'make_global_settings': [
          ['LD', 'third_party/llvm-build/Release+Asserts/bin/lld-link.exe'],
        ],
      }],
  ],
  'target_defaults': {
    'default_configuration': 'Release',
    'variables': {
      'conditions': [
        ['OS=="win" and component=="shared_library"', {
          # See http://msdn.microsoft.com/en-us/library/aa652367.aspx
          'win_release_RuntimeLibrary%': '2', # 2 = /MD (nondebug DLL)
          'win_debug_RuntimeLibrary%': '3',   # 3 = /MDd (debug DLL)
        }, {
          # See http://msdn.microsoft.com/en-us/library/aa652367.aspx
          'win_release_RuntimeLibrary%': '0', # 0 = /MT (nondebug static)
          'win_debug_RuntimeLibrary%': '1',   # 1 = /MTd (debug static)
        }],
      ],
    },
    'configurations': {
      'Common_Base': {
        'abstract': 1,
        'msvs_settings':{
          'VCCLCompilerTool': {
            'AdditionalOptions': [
              '/bigobj',
              # Tell the compiler to crash on failures. This is undocumented
              # and unsupported but very handy.
              '/d2FastFail',
            ],
          },
          'VCLinkerTool': {
            # Add the default import libs.
            'AdditionalDependencies': [
              'kernel32.lib',
              'gdi32.lib',
              'winspool.lib',
              'comdlg32.lib',
              'advapi32.lib',
              'shell32.lib',
              'ole32.lib',
              'oleaut32.lib',
              'user32.lib',
              'uuid.lib',
              'odbc32.lib',
              'odbccp32.lib',
              'delayimp.lib',
              'credui.lib',
              'dbghelp.lib',
              'shlwapi.lib',
              'winmm.lib',
              #'msvcprt.lib',
            ],
            'AdditionalOptions': [
              # Suggested by Microsoft Devrel to avoid
              #   LINK : fatal error LNK1248: image size (80000000) exceeds maximum allowable size (80000000)
              # which started happening more regularly after VS2013 Update 4.
              # Needs to be a bit lower for VS2015, or else errors out.
              '/maxilksize:0x7ff00000',
              # Tell the linker to crash on failures.
              '/fastfail',
            ],
          },
        },
        'conditions': [
          ['OS=="win" and win_fastlink==1 and MSVS_VERSION != "2013"', {
            'msvs_settings': {
              'VCLinkerTool': {
                # /PROFILE is incompatible with /debug:fastlink
                'Profile': 'false',
                'AdditionalOptions': [
                  # Tell VS 2015+ to create a PDB that references debug
                  # information in .obj and .lib files instead of copying
                  # it all.
                  '/DEBUG:FASTLINK',
                ],
              },
            },
          }],
          ['OS=="win"', {
            'msvs_settings': {
              'VCCLCompilerTool': {
                'AdditionalOptions': [
                  '/Zc:dllexportInlines-',
                ],
              },
            },
          }],
          ['OS=="win" and MSVS_VERSION == "2015"', {
            'msvs_settings': {
              'VCCLCompilerTool': {
                'AdditionalOptions': [
                  # Work around crbug.com/526851, bug in VS 2015 RTM compiler.
                  '/Zc:sizedDealloc-',
                  # Disable thread-safe statics to avoid overhead and because
                  # they are disabled on other platforms. See crbug.com/587210
                  # and -fno-threadsafe-statics.
                  '/Zc:threadSafeInit-',
                ],
              },
            },
          }],
        ],
      },
      'Debug_Base': {
        'abstract': 1,
        'variables': {
          'v8_enable_handle_zapping': 1,
          'conditions': [
            ['node_shared != "true"', {
              'MSVC_runtimeType': 1,    # MultiThreadedDebug (/MTd)
            }, {
              'MSVC_runtimeType': 3,    # MultiThreadedDebugDLL (/MDd)
            }],
          ],
        },
        'defines': [ 'DEBUG', '_DEBUG', 'V8_ENABLE_CHECKS', '_HAS_ITERATOR_DEBUGGING=0' ],
        'cflags': [ '-g', '-O0' ],
        'conditions': [
          ['OS in "aix os400"', {
            'cflags': [ '-gxcoff' ],
            'ldflags': [ '-Wl,-bbigtoc' ],
          }],
          ['OS == "android"', {
            'cflags': [ '-fPIC' ],
            'ldflags': [ '-fPIC' ]
          }],
        ],
        'msvs_settings': {
          'VCCLCompilerTool': {
            'RuntimeLibrary': '<(win_debug_RuntimeLibrary)', # static debug
            'MinimalRebuild': 'false',
            'OmitFramePointers': 'false',
            'Optimization': 0,              # /Od, no optimization
          },
          'VCLinkerTool': {
            'LinkIncremental': 2, # enable incremental linking
          },
        },
        'xcode_settings': {
          'GCC_OPTIMIZATION_LEVEL': '0', # stop gyp from defaulting to -Os
        },
      },
      'Release_Base': {
        'abstract': 1,
        'variables': {
          'v8_enable_handle_zapping': 0,
          'pgo_generate': ' -fprofile-generate ',
          'pgo_use': ' -fprofile-use -fprofile-correction ',
          'conditions': [
            ['node_shared != "true"', {
              'MSVC_runtimeType': 0    # MultiThreaded (/MT)
            }, {
              'MSVC_runtimeType': 2   # MultiThreadedDLL (/MD)
            }],
            ['llvm_version=="0.0"', {
              'lto': ' -flto=4 -fuse-linker-plugin -ffat-lto-objects ', # GCC
            }, {
              'lto': ' -flto ', # Clang
            }],
          ],
        },
        'cflags': [ '-O3' ],
        'conditions': [
          ['enable_lto=="true"', {
            'cflags': ['<(lto)'],
            'ldflags': ['<(lto)'],
            'xcode_settings': {
              'LLVM_LTO': 'YES',
            },
          }],
          ['OS=="linux"', {
            'conditions': [
              ['node_section_ordering_info!=""', {
                'cflags': [
                  '-fuse-ld=gold',
                  '-ffunction-sections',
                ],
                'ldflags': [
                  '-fuse-ld=gold',
                  '-Wl,--section-ordering-file=<(node_section_ordering_info)',
                ],
              }],
            ],
          }],
          ['OS=="solaris"', {
            # pull in V8's postmortem metadata
            'ldflags': [ '-Wl,-z,allextract' ]
          }],
          ['OS=="zos"', {
            # increase performance, number from experimentation
            'cflags': [ '-qINLINE=::150:100000' ]
          }],
          ['OS!="mac" and OS!="win" and OS!="zos"', {
            # -fno-omit-frame-pointer is necessary for the --perf_basic_prof
            # flag to work correctly. perf(1) gets confused about JS stack
            # frames otherwise, even with --call-graph dwarf.
            'cflags': [ '-fno-omit-frame-pointer' ],
          }],
          ['OS=="linux"', {
            'conditions': [
              ['enable_pgo_generate=="true"', {
                'cflags': ['<(pgo_generate)'],
                'ldflags': ['<(pgo_generate)'],
              },],
              ['enable_pgo_use=="true"', {
                'cflags': ['<(pgo_use)'],
                'ldflags': ['<(pgo_use)'],
              },],
            ],
          },],
          ['OS == "android"', {
            'cflags': [ '-fPIC' ],
            'ldflags': [ '-fPIC' ]
          }],
        ],
        'msvs_settings': {
          'VCCLCompilerTool': {
            'conditions': [
              ['target_arch=="arm64"', {
                'FloatingPointModel': 1 # /fp:strict
              }]
            ],
            'EnableFunctionLevelLinking': 'true',
            'EnableIntrinsicFunctions': 'true',
            'FavorSizeOrSpeed': 1,          # /Ot, favor speed over size
            'InlineFunctionExpansion': 2,   # /Ob2, inline anything eligible
            'OmitFramePointers': 'true',
            'Optimization': 3,              # /Ox, full optimization
            'RuntimeLibrary': '<(win_release_RuntimeLibrary)',
            'RuntimeTypeInfo': 'false',
          }
        },
        'xcode_settings': {
          'GCC_OPTIMIZATION_LEVEL': '3', # stop gyp from defaulting to -Os
        },
      },
      'Debug': {
        'inherit_from': ['Common_Base', 'Debug_Base'],
      },
      'Release': {
        'inherit_from': ['Common_Base', 'Release_Base'],
      },
      'conditions': [
        [ 'OS=="win"', {
              'Debug_x64': { 'inherit_from': ['Debug'] },
              'Release_x64': { 'inherit_from': ['Release'], },
        }],
      ],
    },

    # Defines these mostly for node-gyp to pickup, and warn addon authors of
    # imminent V8 deprecations, also to sync how dependencies are configured.
    'defines': [
      'V8_DEPRECATION_WARNINGS',
      'V8_REVERSE_JSARGS',
      #'V8_IMMINENT_DEPRECATION_WARNINGS',
      '_GLIBCXX_USE_CXX11_ABI=1',
      '_LIBCPP_HAS_NO_VENDOR_AVAILABILITY_ANNOTATIONS',
    ],

    # Forcibly disable -Werror.  We support a wide range of compilers, it's
    # simply not feasible to squelch all warnings, never mind that the
    # libraries in deps/ are not under our control.

    'msvs_settings': {
      'VCCLCompilerTool': {
        'AdditionalOptions': [
          '/Zc:__cplusplus',
          '-std:c++17'
        ],
        'BufferSecurityCheck': 'true',
        'DebugInformationFormat': 1,          # /Z7 embed info in .obj files
        'ExceptionHandling': 0,               # /EHsc
        'MultiProcessorCompilation': 'true',
        'StringPooling': 'true',              # pool string literals
        'SuppressStartupBanner': 'true',
        'WarnAsError': 'false',
        'WarningLevel': 3,                    # /W3
      },
      'VCLinkerTool': {
        'target_conditions': [
          ['_type=="executable"', {
            'SubSystem': 1,                   # /SUBSYSTEM:CONSOLE
          }],
        ],
        'conditions': [
          ['target_arch=="ia32"', {
            'TargetMachine' : 1,              # /MACHINE:X86
          }],
          ['target_arch=="x64"', {
            'TargetMachine' : 17,             # /MACHINE:X64
          }],
          ['target_arch=="arm64"', {
            'TargetMachine' : 0,              # NotSet. MACHINE:ARM64 is inferred from the input files.
          }],
        ],
        'GenerateDebugInformation': 'true',
        'SuppressStartupBanner': 'true',
      },
    },
    # Disable warnings:
    # - "C4251: class needs to have dll-interface"
    # - "C4275: non-DLL-interface used as base for DLL-interface"
    #   Over 10k of these warnings are generated when compiling node,
    #   originating from v8.h. Most of them are false positives.
    #   See also: https://github.com/nodejs/node/pull/15570
    #   TODO: re-enable when Visual Studio fixes these upstream.
    #
    # - "C4267: conversion from 'size_t' to 'int'"
    #   Many any originate from our dependencies, and their sheer number
    #   drowns out other, more legitimate warnings.
    # - "C4244: conversion from 'type1' to 'type2', possible loss of data"
    #   Ususaly safe. Disable for `dep`, enable for `src`
    'msvs_cygwin_shell': 0, # prevent actions from trying to use cygwin

    'msvs_disabled_warnings': [4351, 4355, 4800, 4251, 4275, 4244, 4267, 4595],
    'conditions': [
      [ 'error_on_warn=="false"', {
        'cflags!': ['-Werror'],
      }, '(_target_name!="<(node_lib_target_name)" or '
          '_target_name!="<(node_core_target_name)")', {
        'cflags!': ['-Werror'],
      }],
      [ 'configuring_node', {
        'msvs_configuration_attributes': {
          'OutputDirectory': '<(DEPTH)/out/$(Configuration)/',
          'IntermediateDirectory': '$(OutDir)obj/$(ProjectName)/'
        },
      }],
      [ 'target_arch=="x64"', {
        'msvs_configuration_platform': 'x64',
      }],
      [ 'target_arch=="arm64"', {
        'msvs_configuration_platform': 'arm64',
      }],
      ['asan == 1 and OS != "mac" and OS != "zos"', {
        'cflags+': [
          '-fno-omit-frame-pointer',
          '-fsanitize=address',
          '-fsanitize-address-use-after-scope',
        ],
        'defines': [ 'LEAK_SANITIZER', 'V8_USE_ADDRESS_SANITIZER' ],
        'cflags!': [ '-fomit-frame-pointer' ],
        'ldflags': [ '-fsanitize=address' ],
      }],
      ['asan == 1 and OS == "mac"', {
        'xcode_settings': {
          'OTHER_CFLAGS+': [
            '-fno-omit-frame-pointer',
            '-gline-tables-only',
            '-fsanitize=address',
            '-DLEAK_SANITIZER'
          ],
          'OTHER_CFLAGS!': [
            '-fomit-frame-pointer',
          ],
        },
        'target_conditions': [
          ['_type!="static_library"', {
            'xcode_settings': {'OTHER_LDFLAGS': ['-fsanitize=address']},
          }],
        ],
      }],
      ['v8_enable_pointer_compression == 1', {
        'defines': [
          'V8_COMPRESS_POINTERS',
          'V8_COMPRESS_POINTERS_IN_ISOLATE_CAGE',
        ],
      }],
      ['target_arch=="x64"', {
        'defines': ['V8_VIRTUAL_MEMORY_CAGE'],
      }],
      ['v8_enable_pointer_compression == 1 or v8_enable_31bit_smis_on_64bit_arch == 1', {
        'defines': ['V8_31BIT_SMIS_ON_64BIT_ARCH'],
      }],
      ['OS == "win"', {
        'defines': [
          'WIN32',
          # we don't really want VC++ warning us about
          # how dangerous C functions are...
          '_CRT_SECURE_NO_DEPRECATE',
          # ... or that C implementations shouldn't use
          # POSIX names
          '_CRT_NONSTDC_NO_DEPRECATE',
          # Make sure the STL doesn't try to use exceptions
          '_HAS_EXCEPTIONS=1',
          #'BUILDING_V8_SHARED=1',
          'BUILDING_UV_SHARED=1',
        ],
        'conditions': [
          [ 'building_nw==1 and component=="shared_library"', {
            'defines': [ '_LIBCPP_NO_AUTO_LINK' ],
            'include_dirs': [ '<(DEPTH)/buildtools/third_party/libc++/trunk/include'],
          }],
          [ 'building_nw==1 and component!="shared_library"', {
            'defines': [ '_LIBCPP_DISABLE_VISIBILITY_ANNOTATIONS' ],
            'include_dirs': [ #'<(DEPTH)/buildtools/third_party/libc++/trunk/include',
                              #'<(DEPTH)/buildtools/third_party/libc++',
                            ],
          }],
        ],
      }],
      [ 'OS in "linux freebsd openbsd solaris aix os400"', {
        'cflags': [ '-pthread' ],
        'ldflags': [ '-pthread' ],
      }],
      [ 'OS in "linux freebsd openbsd solaris android aix os400 cloudabi"', {
        'cflags': [ '-Wall', '-Wextra', '-Wno-unused-parameter', ],
        'cflags_cc': [ '-fno-rtti', '-fno-exceptions', '-std=gnu++17' ],
        'defines': [ '__STDC_FORMAT_MACROS' ],
        'ldflags': [ '-rdynamic' ],
        'target_conditions': [
          # The 1990s toolchain on SmartOS can't handle thin archives.
          ['_type=="static_library" and OS=="solaris"', {
            'standalone_static_library': 1,
          }],
          ['OS=="openbsd"', {
            'cflags': [ '-I/usr/local/include' ],
            'ldflags': [ '-Wl,-z,wxneeded' ],
          }],
          ['_toolset=="host"', {
            'conditions': [
              ['clang==1 and OS=="linux"', {
                'cflags': ['-I/usr/include/c++/13', '-I/usr/include/x86_64-linux-gnu/' ],
              }],
              [ 'host_arch=="ia32"', {
                'cflags': [ '-m32' ],
                'ldflags': [ '-m32' ],
              }],
              [ 'host_arch=="x64"', {
                'cflags': [ '-m64' ],
                'ldflags': [ '-m64' ],
              }],
              [ 'host_arch=="ppc" and OS not in "aix os400"', {
                'cflags': [ '-m32' ],
                'ldflags': [ '-m32' ],
              }],
              [ 'host_arch=="ppc64" and OS not in "aix os400"', {
                'cflags': [ '-m64', '-mminimal-toc' ],
                'ldflags': [ '-m64' ],
              }],
              [ 'host_arch=="s390x" and OS=="linux"', {
                'cflags': [ '-m64', '-march=z196' ],
                'ldflags': [ '-m64', '-march=z196' ],
              }],
            ],
          }],
          ['_toolset=="target"', {
            'conditions': [
              [ 'building_nw==1 and OS=="linux"', {
                'cflags': [ '--sysroot=<(sysroot)', '-nostdinc++', 
                        '-isystem<(PRODUCT_DIR)/../../buildtools/third_party/libc++/trunk/include', 
                        '-isystem<(PRODUCT_DIR)/../../buildtools/third_party/libc++', 
                        '-isystem<(PRODUCT_DIR)/../../buildtools/third_party/libc++abi/trunk/include' ],
                'ldflags': [ '--sysroot=<(sysroot)','<!(<(DEPTH)/content/nw/tools/sysroot_ld_path.sh <(sysroot))', '-nostdlib++' ],
              }],
              ['clang==1', {
                'cflags': ['-Wno-error=missing-declarations', '-Wno-error=array-bounds'],
                'defines': [ '_LIBCPP_ABI_NAMESPACE=__1' ],
              }],
              [ 'target_arch=="ia32"', {
                'cflags': [ '-m32' ],
                'ldflags': [ '-m32' ],
              }],
              [ 'target_arch=="x64"', {
                'cflags': [ '-m64' ],
                'ldflags': [ '-m64' ],
              }],
              [ 'target_arch=="ppc" and OS not in "aix os400"', {
                'cflags': [ '-m32' ],
                'ldflags': [ '-m32' ],
              }],
              [ 'target_arch=="ppc64" and OS not in "aix os400"', {
                'cflags': [ '-m64', '-mminimal-toc' ],
                'ldflags': [ '-m64' ],
              }],
              [ 'target_arch=="s390x" and OS=="linux"', {
                'cflags': [ '-m64', '-march=z196' ],
                'ldflags': [ '-m64', '-march=z196' ],
              }],
            ],
          }],
        ],
        'conditions': [
          [ 'OS=="linux" and target_arch=="arm"', {
            'cflags': [ '--target=arm-linux-gnueabihf' ],
            'ldflags': [ '--target=arm-linux-gnueabihf' ],
          }],
          [ 'OS=="solaris"', {
            'cflags': [ '-pthreads' ],
            'ldflags': [ '-pthreads' ],
            'cflags!': [ '-pthread' ],
            'ldflags!': [ '-pthread' ],
          }],
          [ 'node_shared=="true"', {
            'cflags': [ '-fPIC' ],
          }],
        ],
      }],
      [ 'OS in "aix os400"', {
        'variables': {
          # Used to differentiate `AIX` and `OS400`(IBM i).
          'aix_variant_name': '<!(uname -s)',
        },
        'cflags': [ '-maix64', ],
        'ldflags!': [ '-rdynamic', ],
        'ldflags': [
          '-Wl,-bbigtoc',
          '-maix64',
        ],
        'conditions': [
          [ '"<(aix_variant_name)"=="OS400"', {            # a.k.a. `IBM i`
            'ldflags': [
              '-Wl,-blibpath:/QOpenSys/pkgs/lib:/QOpenSys/usr/lib',
              '-Wl,-brtl',
            ],
          }, {                                             # else it's `AIX`
            # Disable the following compiler warning:
            #
            #   warning: visibility attribute not supported in this
            #   configuration; ignored [-Wattributes]
            #
            # This is gcc complaining about __attribute((visibility("default"))
            # in static library builds. Legitimate but harmless and it drowns
            # out more relevant warnings.
            'cflags': [ '-Wno-attributes' ],
            'ldflags': [
              '-Wl,-blibpath:/usr/lib:/lib:/opt/freeware/lib/pthread/ppc64',
            ],
          }],
        ],
      }],
      ['OS=="android"', {
        'target_conditions': [
          ['_toolset=="target"', {
            'defines': [ '_GLIBCXX_USE_C99_MATH' ],
            'libraries': [ '-llog' ],
          }],
          ['_toolset=="host"', {
            'cflags': [ '-pthread' ],
            'ldflags': [ '-pthread' ],
          }],
        ],
      }],
      ['OS=="mac"', {
        'defines': ['_DARWIN_USE_64_BIT_INODE=1'],
        'xcode_settings': {
          'ALWAYS_SEARCH_USER_PATHS': 'NO',
          'GCC_CW_ASM_SYNTAX': 'NO',                # No -fasm-blocks
          'GCC_DYNAMIC_NO_PIC': 'NO',               # No -mdynamic-no-pic
                                                    # (Equivalent to -fPIC)
          'GCC_ENABLE_CPP_EXCEPTIONS': 'NO',        # -fno-exceptions
          'GCC_ENABLE_CPP_RTTI': 'NO',              # -fno-rtti
          'GCC_ENABLE_PASCAL_STRINGS': 'NO',        # No -mpascal-strings
          'PREBINDING': 'NO',                       # No -Wl,-prebind
          'MACOSX_DEPLOYMENT_TARGET': '10.15',      # -mmacosx-version-min=10.15
          'USE_HEADERMAP': 'NO',
          'OTHER_CFLAGS': [
            '-fno-strict-aliasing',
          ],
          'WARNING_CFLAGS': [
            '-Wall',
            '-Wendif-labels',
            '-W',
            '-Wno-unused-parameter',
          ],
        },
        'target_conditions': [
          ['_type!="static_library"', {
            'xcode_settings': {
              'OTHER_LDFLAGS': [
                '-Wl,-search_paths_first'
              ],
            },
          }],
        ],
        'conditions': [
          ['target_arch=="ia32"', {
            'xcode_settings': {'ARCHS': ['i386']},
          }],
          ['target_arch=="x64"', {
            'xcode_settings': {'ARCHS': ['x86_64']},
          }],
          ['target_arch=="arm64"', {
            'xcode_settings': {
              'ARCHS': ['arm64'],
              'OTHER_LDFLAGS!': [
                '-Wl,-no_pie',
              ],
            },
          }],
          ['clang==1', {
            'xcode_settings': {
              'GCC_VERSION': 'com.apple.compilers.llvm.clang.1_0',
              'CLANG_CXX_LANGUAGE_STANDARD': 'gnu++17',  # -std=gnu++17
              'CLANG_CXX_LIBRARY': 'libc++',
            },
          }],
        ],
      }],
      ['OS=="freebsd"', {
        'ldflags': [
          '-Wl,--export-dynamic',
        ],
      }],
      # if node is built as an executable,
      #      the openssl mechanism for keeping itself "dload"-ed to ensure proper
      #      atexit cleanup does not apply
      ['node_shared_openssl!="true" and node_shared!="true"', {
        'defines': [
          # `OPENSSL_NO_PINSHARED` prevents openssl from dload
          #      current node executable,
          #      see https://github.com/nodejs/node/pull/21848
          #      or https://github.com/nodejs/node/issues/27925
          'OPENSSL_NO_PINSHARED'
        ],
      }],
      ['node_shared_openssl!="true"', {
        # `OPENSSL_THREADS` is defined via GYP for openSSL for all architectures.
        'defines': [
          'OPENSSL_THREADS',
        ],
      }],
      ['node_shared_openssl!="true" and openssl_no_asm==1', {
        'defines': [
          'OPENSSL_NO_ASM',
        ],
      }],
      ['OS == "zos"', {
        'defines': [
          '_XOPEN_SOURCE_EXTENDED',
          '_XOPEN_SOURCE=600',
          '_UNIX03_THREADS',
          '_UNIX03_WITHDRAWN',
          '_UNIX03_SOURCE',
          '_OPEN_SYS_SOCK_IPV6',
          '_OPEN_SYS_FILE_EXT=1',
          '_POSIX_SOURCE',
          '_OPEN_SYS',
          '_OPEN_SYS_IF_EXT',
          '_OPEN_SYS_SOCK_IPV6',
          '_OPEN_MSGQ_EXT',
          '_LARGE_TIME_API',
          '_ALL_SOURCE',
          '_AE_BIMODAL=1',
          '__IBMCPP_TR1__',
          'NODE_PLATFORM="os390"',
          'PATH_MAX=1024',
          '_ENHANCED_ASCII_EXT=0xFFFFFFFF',
          '_Export=extern',
          '__static_assert=static_assert',
        ],
        'cflags': [
          '-q64',
          '-Wc,DLL',
          '-Wa,GOFF',
          '-qARCH=10',
          '-qASCII',
          '-qTUNE=12',
          '-qENUM=INT',
          '-qEXPORTALL',
          '-qASM',
        ],
        'cflags_cc': [
          '-qxclang=-std=c++14',
        ],
        'ldflags': [
          '-q64',
        ],
        # for addons due to v8config.h include of "zos-base.h":
        'include_dirs':  ['<(zoslib_include_dir)'],
      }],
    ],
  }
}
