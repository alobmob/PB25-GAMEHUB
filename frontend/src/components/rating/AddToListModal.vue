<script setup>
import { ref } from 'vue'

import Dialog from '../ui/dialog/Dialog.vue'
import DialogContent from '../ui/dialog/DialogContent.vue'
import DialogHeader from '../ui/dialog/DialogHeader.vue'
import DialogTitle from '../ui/dialog/DialogTitle.vue'
import DialogFooter from '../ui/dialog/DialogFooter.vue'

import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Label from '../ui/Label.vue'
import Checkbox from '../ui/Checkbox.vue'

import { Plus } from 'lucide-vue-next'
import { mockGameLists } from '../../utils/mockData.js'

const props = defineProps({
  open: Boolean,
  onOpenChange: Function,
  gameTitle: String
})

const showNewList = ref(false)
const newListName = ref('')
const isPublic = ref(false)
const selectedLists = ref([])

const toggleList = (id) => {
  if (selectedLists.value.includes(id)) {
    selectedLists.value = selectedLists.value.filter(l => l !== id)
  } else {
    selectedLists.value.push(id)
  }
}

const handleSubmit = () => {
  if (showNewList.value && newListName.value.trim()) {
    alert(`Utworzono liste "${newListName.value}" i dodano gre`)
  } else if (selectedLists.value.length > 0) {
    alert('Gra zostala dodana do wybranych list')
  } else {
    alert('Wybierz liste lub utworz nowa')
    return
  }

  props.onOpenChange(false)
  showNewList.value = false
  newListName.value = ''
  isPublic.value = false
  selectedLists.value = []
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dodaj do listy</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <p class="text-sm text-gray-600">{{ gameTitle }}</p>

        <template v-if="!showNewList">
          <div class="space-y-2">
            <Label>Wybierz listę</Label>

            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div
                  v-for="list in mockGameLists"
                  :key="list.id"
                  class="flex items-center space-x-2"
              >
                <Checkbox
                    :id="'list-' + list.id"
                    :checked="selectedLists.includes(list.id)"
                    @update:checked="() => toggleList(list.id)"
                />
                <label
                    :for="'list-' + list.id"
                    class="text-sm cursor-pointer flex-1"
                >
                  {{ list.name }}
                  <span class="text-xs text-gray-500 ml-2">
                    ({{ list.isPublic ? 'Publiczna' : 'Prywatna' }})
                  </span>
                </label>
              </div>
            </div>
          </div>

          <Button
              variant="outline"
              class="w-full"
              @click="showNewList = true"
          >
            <Plus class="size-4 mr-2" />
            Nowa lista
          </Button>
        </template>

        <template v-else>
          <div class="space-y-2">
            <Label for="list-name">Nazwa listy</Label>
            <Input
                id="list-name"
                v-model="newListName"
                placeholder="np. Do ogrania"
            />
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox
                id="is-public"
                v-model:checked="isPublic"
            />
            <label for="is-public" class="text-sm cursor-pointer">
              Lista publiczna
            </label>
          </div>

          <Button
              variant="ghost"
              size="sm"
              @click="showNewList = false"
          >
            Powrót do wyboru listy
          </Button>
        </template>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="onOpenChange(false)">
          Anuluj
        </Button>

        <Button @click="handleSubmit">
          {{ showNewList ? 'Utwórz i dodaj' : 'Dodaj do listy' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>