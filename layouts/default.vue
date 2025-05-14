<script setup lang="ts">
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import AppSidebar from "@/components/AppSidebar.vue";

const route = useRoute();

const routeName = computed(() => {
  return route.name == 'index' ? 'Dashboard' : route.name[0].toUpperCase() + route.name.slice(1);
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <!-- <main> -->
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                    {{routeName}}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <!-- <BreadcrumbSeparator class="hidden md:block"/>
                <BreadcrumbItem>
                    <BreadcrumbPage class="hidden md:block">2</BreadcrumbPage>
                </BreadcrumbItem> -->
                </BreadcrumbList>
            </Breadcrumb>
            </div>
        </header>
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <NuxtPage />
        </div>
        </SidebarInset>
      <!-- <NuxtPage /> -->
    <!-- </main> -->
  </SidebarProvider>
</template>