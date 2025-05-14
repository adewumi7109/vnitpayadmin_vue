<script setup lang="ts">
import { Calendar, Home, Inbox, Search, Settings, Users, IdCard, BriefcaseBusiness, MessageCircleIcon, LayoutDashboard } from "lucide-vue-next"
import { useAppStore } from "~/stores/app";
const appStore = useAppStore();


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Requests",
    url: "requests",
    icon: MessageCircleIcon,
  },
  {
    title: "Transfers",
    url: "paystack-transfers",
    icon: Calendar,
  },
  {
    title: "Settlements",
    url: "settlements",
    icon: Inbox,
  },
  {
    title: "Summaries",
    url: "account-summaries",
    icon: Settings,
  },
  {
    title: "Merchants",
    url: "merchants",
    icon: BriefcaseBusiness,
  },
  {
    title: "Cards",
    url: "cards",
    icon: IdCard,
  },
  {
    title: "Users",
    url: "users",
    icon: Users,
  }
];
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <div class="pt-4 pl-2">
        <LogoDark />
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel></SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <NuxtLink :to="item.url">
                      <component :is="item.icon" />
                      <span>{{item.title}}</span>
                    </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
                  {{appStore.getName}}
                  <!-- <ChevronUp class="ml-auto" /> -->
                </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
  </Sidebar>
</template>