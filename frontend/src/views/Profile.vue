<script setup>
import { ref, computed } from 'vue'

import GameCard from '../components/cards/GameCard.vue'
import CommentItem from '../components/rating/CommentItem.vue'

import Tabs from '../components/ui/tabs/Tabs.vue'
import TabsList from '../components/ui/tabs/TabsList.vue'
import TabsTrigger from '../components/ui/tabs/TabsTrigger.vue'
import TabsContent from '../components/ui/tabs/TabsContent.vue'

import Card from '../components/ui/card/Card.vue'
import CardHeader from '../components/ui/card/CardHeader.vue'
import CardTitle from '../components/ui/card/CardTitle.vue'
import CardContent from '../components/ui/card/CardContent.vue'

import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'

import EditUserModal from '../components/ui/EditUserModal.vue'
import ManageListsModal from '../components/ui/ManageListsModal.vue'

import { User, Mail, Calendar, Edit, Lock, Unlock } from 'lucide-vue-next'

import { mockGames, mockGameLists, mockRatings } from '../utils/mockData'

const selectedList = ref(mockGameLists[0])
const lists = ref([...mockGameLists])

const user = {
  displayName: 'Jan Kowalski',
  email: 'jan.kowalski@example.com',
  joinDate: '2023-01-15'
}

const editModalOpen = ref(false)
const manageListsOpen = ref(false)

const userRatings = computed(() =>
    mockRatings.filter(r => r.userId === '1')
)

const userGamesInLists = computed(() =>
    lists.value
        .flatMap(list => list.gameIds.map(id => mockGames.find(g => g.id === id)))
        .filter(Boolean)
)

const currentTab = ref('lists')
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div class="lg:col-span-1">
          <Card>
            <CardHeader>
              <div class="flex justify-center mb-4">
                <div class="bg-purple-100 p-6 rounded-full">
                  <User class="size-12 text-purple-600" />
                </div>
              </div>
              <CardTitle class="text-center">{{ user.displayName }}</CardTitle>
            </CardHeader>

            <CardContent class="space-y-3">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Mail class="size-4" />
                <span>{{ user.email }}</span>
              </div>

              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Calendar class="size-4" />
                <span>Dołączył {{ user.joinDate }}</span>
              </div>

              <div class="pt-4 space-y-2">
                <Button
                    variant="outline"
                    class="w-full justify-start"
                    size="sm"
                    @click="editModalOpen = true"
                >
                  <Edit class="size-4 mr-2" />
                  Edytuj profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="lg:col-span-3">
          <Tabs v-model="currentTab" class="space-y-6">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="lists">Moje listy</TabsTrigger>
              <TabsTrigger value="ratings">Moje oceny</TabsTrigger>
              <TabsTrigger value="comments">Moje komentarze</TabsTrigger>
            </TabsList>

            <TabsContent value="lists" class="space-y-6">
              <div class="flex items-center justify-between">
                <h2>Moje listy</h2>
                <Button @click="manageListsOpen = true">Zarządzaj listami</Button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                    v-for="list in lists"
                    :key="list.id"
                    class="cursor-pointer transition-shadow"
                    :class="selectedList.id === list.id ? 'ring-2 ring-purple-600' : ''"
                    @click="selectedList = list"
                >
                  <CardContent class="p-4">
                    <div class="flex items-start justify-between mb-2">
                      <h3>{{ list.name }}</h3>
                      <Unlock v-if="list.isPublic" class="size-4 text-green-600" />
                      <Lock v-else class="size-4 text-gray-400" />
                    </div>

                    <p class="text-sm text-gray-600">
                      {{ list.gameIds.length }}
                      {{ list.gameIds.length === 1 ? 'gra' : 'gier' }}
                    </p>

                    <Badge :variant="list.isPublic ? 'default' : 'secondary'" class="mt-2">
                      {{ list.isPublic ? 'Publiczna' : 'Prywatna' }}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 class="mb-4">{{ selectedList.name }}</h3>

                <div
                    v-if="selectedList.gameIds.length > 0"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <GameCard
                      v-for="id in selectedList.gameIds"
                      :key="id"
                      :game="mockGames.find(g => g.id === id)"
                  />
                </div>

                <Card v-else>
                  <CardContent class="p-6 text-center text-gray-500">
                    Ta lista jest pusta
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ratings" class="space-y-6">
              <h2>Moje oceny</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <GameCard
                    v-for="game in userGamesInLists"
                    :key="game.id"
                    :game="game"
                />
              </div>
            </TabsContent>

            <TabsContent value="comments" class="space-y-6">
              <h2>Moje komentarze</h2>

              <div v-if="userRatings.length > 0" class="space-y-4">
                <CommentItem
                    v-for="rating in userRatings"
                    :key="rating.id"
                    :rating="rating"
                />
              </div>

              <Card v-else>
                <CardContent class="p-6 text-center text-gray-500">
                  Nie dodałeś jeszcze żadnych komentarzy
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>

    <EditUserModal
        :open="editModalOpen"
        @update:open="editModalOpen = $event"
        :currentDisplayName="user.displayName"
        :currentEmail="user.email"
    />

    <ManageListsModal
        :open="manageListsOpen"
        :lists="lists"
        @update:open="manageListsOpen = $event"
        @update:lists="lists = $event"
    />
  </div>
</template>