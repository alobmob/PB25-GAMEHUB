<script setup>
import { ref, watch } from 'vue'

import Dialog from './dialog/Dialog.vue'
import DialogContent from './dialog/DialogContent.vue'
import DialogHeader from './dialog/DialogHeader.vue'
import DialogTitle from './dialog/DialogTitle.vue'

import Button from './Button.vue'
import Input from './Input.vue'
import Label from './Label.vue'
import ScrollArea from './ScrollArea.vue'

import { Trash2, Save, Plus } from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, required: true },
  lists: { type: Array, required: true }
})

const emit = defineEmits(['update:open', 'update:lists'])

const localLists = ref([])
const editingListId = ref(null)
const editingName = ref('')
const newListName = ref('')
const errors = ref({})

watch(
    () => props.open,
    (value) => {
      if (value) {
        localLists.value = JSON.parse(JSON.stringify(props.lists))
        editingListId.value = null
        editingName.value = ''
        newListName.value = ''
        errors.value = {}
      }
    }
)

const close = () => emit('update:open', false)

const startEdit = (list) => {
  editingListId.value = list.id
  editingName.value = list.name
  errors.value = {}
}

const saveEdit = (listId) => {
  if (!editingName.value.trim()) {
    errors.value = { [listId]: 'Nazwa listy nie może być pusta' }
    return
  }

  localLists.value = localLists.value.map((list) =>
      list.id === listId ? { ...list, name: editingName.value } : list
  )

  emit('update:lists', localLists.value)

  editingListId.value = null
  editingName.value = ''
  errors.value = {}
}

const cancelEdit = () => {
  editingListId.value = null
  editingName.value = ''
  errors.value = {}
}

const deleteList = (id) => {
  localLists.value = localLists.value.filter((l) => l.id !== id)
  emit('update:lists', localLists.value)
}

const addList = () => {
  if (!newListName.value.trim()) {
    errors.value = { new: 'Nazwa listy nie może być pusta' }
    return
  }

  const newList = {
    id: `list-${Date.now()}`,
    name: newListName.value,
    gameIds: [],
    isPublic: false
  }

  localLists.value.push(newList)
  emit('update:lists', localLists.value)

  newListName.value = ''
  errors.value = {}
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Zarządzaj listami</DialogTitle>
      </DialogHeader>

      <div class="space-y-6 py-4">
        <div class="space-y-3">
          <Label>Twoje listy</Label>

          <ScrollArea class="h-[300px] pr-4">
            <div class="space-y-3">
              <template v-if="localLists.length > 0">
                <div
                    v-for="list in localLists"
                    :key="list.id"
                    class="flex items-start gap-3 p-3 border rounded-lg bg-gray-50"
                >
                  <div class="flex-1 space-y-2">
                    <template v-if="editingListId === list.id">
                      <Input
                          v-model="editingName"
                          placeholder="Nazwa listy"
                          :class="errors[list.id] ? 'border-red-500' : ''"
                      />
                      <p v-if="errors[list.id]" class="text-sm text-red-500">
                        {{ errors[list.id] }}
                      </p>
                    </template>

                    <template v-else>
                      <p>{{ list.name }}</p>
                      <p class="text-sm text-gray-500">
                        {{ list.gameIds.length }}
                        {{ list.gameIds.length === 1 ? 'gra' : 'gier' }}
                      </p>
                    </template>
                  </div>

                  <div class="flex gap-2">
                    <template v-if="editingListId === list.id">
                      <Button size="sm" @click="saveEdit(list.id)">
                        <Save class="size-4 mr-1" /> Zapisz
                      </Button>
                      <Button size="sm" variant="outline" @click="cancelEdit">Anuluj</Button>
                    </template>

                    <template v-else>
                      <Button size="sm" variant="outline" @click="startEdit(list)">
                        Edytuj
                      </Button>
                      <Button size="sm" variant="destructive" @click="deleteList(list.id)">
                        <Trash2 class="size-4 mr-1" /> Usuń
                      </Button>
                    </template>
                  </div>
                </div>
              </template>

              <p v-else class="text-center text-gray-500 py-8">
                Nie masz jeszcze żadnych list
              </p>
            </div>
          </ScrollArea>
        </div>

        <div class="space-y-3 pt-4 border-t">
          <Label for="newListName">Nowa lista</Label>

          <div class="flex gap-2">
            <div class="flex-1 space-y-2">
              <Input
                  id="newListName"
                  v-model="newListName"
                  placeholder="Wprowadź nazwę nowej listy"
                  :class="errors.new ? 'border-red-500' : ''"
                  @keyup.enter="addList"
              />
              <p v-if="errors.new" class="text-sm text-red-500">
                {{ errors.new }}
              </p>
            </div>

            <Button @click="addList">
              <Plus class="size-4 mr-1" /> Dodaj
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>