#ifndef _NW_NODE_INTERFACE_H
#define _NW_NODE_INTERFACE_H

#include <vector>

typedef struct _msg_pump_context_t {
#if defined(__APPLE__)
  void* embed_thread;

  // Semaphore to wait for main loop in the polling thread.
  void* embed_sem;

  // Dummy handle to make uv's loop not quit.
  void* dummy_uv_handle;
#endif
  void* loop;
  std::vector<void*>* wakeup_events;
  void* wakeup_event;
  void* idle_handle;
  void* delay_timer;
} msg_pump_context_t;

typedef bool (*IsNodeInitializedFn)();
typedef void (*CallTickCallbackFn)(void* env);
typedef v8::Handle<v8::Value> (*NWTickCallback)(void* env, const v8::Handle<v8::Value> ret);
typedef void (*SetupNWNodeFn)(int argc, char **argv, bool);
typedef void (*GetNodeContextFn)(void*);
typedef void (*SetNodeContextFn)(v8::Isolate* isolate, void* ctx);
typedef void (*SetNWTickCallbackFn)(NWTickCallback tick_callback);
typedef void (*StartNWInstanceFn)(int argc, char *argv[], v8::Handle<v8::Context> ctx, void*);
typedef void* (*GetNodeEnvFn)();
typedef void* (*GetCurrentEnvironmentFn)(v8::Handle<v8::Context> context);
typedef int (*EmitExitFn)(void* env);
typedef void (*RunAtExitFn)(void* env);
typedef void (*VoidHookFn)(void*);
typedef void (*VoidIntHookFn)(void*, int);
typedef int (*UVRunFn)(void*, int);
typedef void (*SetUVRunFn)(UVRunFn);
typedef int (*NodeStartFn)(int argc, char *argv[]);
typedef void (*SetBlobPathFn)(const char *path);
typedef void* (*GetPointerFn)();
typedef void (*VoidPtr2Fn)(void*, void*);
typedef void (*VoidPtr3Fn)(void*, void*, void*);
typedef void (*VoidPtr4Fn)(void*, void*, void*, void*);
typedef void (*VoidPtr4IntFn)(void*, void*, void*, void*, int);
typedef void (*VoidVoidFn)();
typedef int (*IntVoidFn)();
typedef void (*VoidIntFn)(int);
typedef bool (*BoolPtrFn)(void*);
typedef bool (*BoolVoidFn)();
typedef void (*VoidBoolFn)(bool);

#endif
