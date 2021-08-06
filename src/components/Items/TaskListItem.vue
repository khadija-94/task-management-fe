
<template>
  <div class="card tasklist-item" v-if="!isEditing" @click.prevent="startEditing">
    <div class="card-body">
      <div :class="[isNewItem ? 'text-center text-dark font-weight-bold disable-select' : 'text-dark disable-select']">
        <span> {{ displayText }} </span>
      </div>
    </div>
  </div>

  <div class="card" :style="{ headingColor: headingColor }" v-else>
    <div class="card-body">
      <form class="form">
        <div class="form-group">
          <input
            name="taskTitle"
            rows="3"
            class="form-control"
            v-model.trim="form.title"
            v-validate="'required'"
            data-vv-as="Task title"
            placeholder="Task title"
          >
          <small class="text-danger" style="display:block">{{ errors.first("taskTitle") }}</small>
          <label class="label">Start date</label><br/>
          <date-pick
            name="startDate"
            rows="3"
            :class="'form-control'"
            v-model="form.startDate"
            v-validate="'required'"
            :pickTime="true"
            :use12HourClock="true"
            :format="'YYYY-MM-DD HH:mm'"
            :displayFormat="'YYYY-MM-DD H:mm A'"
            data-vv-as="Start date"
            placeholder="Start date"
          ></date-pick>
          <small class="text-danger" style="display:block">{{ errors.first("startDate") }}</small>
          <label class="label">Deadline</label><br/>
          <date-pick
            name="deadline"
            rows="3"
            :class="'form-control'"
            v-model="form.deadLine"
            v-validate="'required'"
            :pickTime="true"
            :use12HourClock="true"
            :format="'YYYY-MM-DD HH:mm'"
            :displayFormat="'YYYY-MM-DD H:mm A'"
            data-vv-as="Deadline"
            placeholder="Deadline"
          ></date-pick>
          <small class="text-danger" style="display:block">{{ errors.first("deadline") }}</small>
          <label class="label">Task Priority</label><br/>
          <div class="priority-div priority">
            <label v-for="p in priorities" v-bind:key="p.key" :class="['radio ' + p.value]">
              <input v-validate="'required'" data-vv-as="Task Priority" type="radio" v-model="form.taskPriority" value="p.key" name="taskPriority" />
              <span v-html="p.value"></span>
            </label>
          </div>
          <small class="text-danger" style="display:block">{{ errors.first("taskPriority") }}</small>
          <input
            name="taskStatus"
            rows="3"
            class="form-control"
            v-model.trim="form.status"
            v-validate="'required'"
            data-vv-as="Task status"
            placeholder="Task status"
          >
          <small class="text-danger" style="display:block">{{ errors.first("taskStatus") }}</small>
          <input
            name="addedBy"
            rows="3"
            class="form-control"
            v-model.trim="form.addedBy"
            v-validate="'required'"
            data-vv-as="Added By"
            placeholder="Added by"
          >
          <small class="text-danger" style="display:block">{{ errors.first("addedBy") }}</small>
          <input
            name="assignedTo"
            rows="3"
            class="form-control"
            v-model.trim="form.assignedTo"
            v-validate="'required'"
            data-vv-as="Assigned To"
            placeholder="Assigned to"
          >
          <small class="text-danger">{{ errors.first("assignedTo") }}</small>
        </div>

        <div :class="[isNewItem ? 'text-center' : 'd-flex justify-content-between', 'form-group']">
          <div>
            <button class="btn btn-outline-secondary btn-sm mr-2" @click.prevent="save">
              Save
            </button>
            <button class="btn btn-outline-secondary btn-sm" @click.prevent="cancel">
              Cancel
            </button>
          </div>
          <div v-show="!isNewItem">
            <button class="btn btn-sm text-danger" @click.prevent="remove">
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import DatePick from 'vue-date-pick'

export default {
  components: { DatePick },
  props: ['item', 'list', 'board'],
  computed: {
    isNewItem () {
      return this.item.id === ''
    },
    displayText () {
      return this.isNewItem ? '+ New Item' : this.item.text
    }
  },
  data () {
    return {
      isEditing: false,
      form: {
        id: '',
        title: '',
        startDate: '',
        deadLine: '',
        taskStatus: '',
        taskPriority: '',
        addedBy: '',
        assignedTo: ''
      },
      headingColor: '#16a085',
      color: [
        '#16a085',
        '#27ae60',
        '#2c3e50',
        '#f39c12',
        '#e74c3c',
        '#9b59b6',
        '#FB6964',
        '#342224',
        '#472E32',
        '#BDBB99',
        '#77B1A9',
        '#73A857'
      ],
      priorities: [{ key: 1, value: 'low' }, { key: 2, value: 'normal' }, { key: 3, value: 'high' }]
    }
  },

  methods: {
    ...mapActions({
      saveTaskListItem: 'saveTaskListItem',
      deleteTaskListItem: 'deleteTaskListItem'
    }),
    startEditing () {
      this.form.id = this.item.id
      this.form.text = this.item.text
      this.isEditing = true
      this.$emit('item-editing')
    },

    clearForm () {
      this.form.id = ''
      this.form.text = ''
    },
    save () {
      this.$validator.validateAll().then(result => {
        if (result) {
          const updatedItem = {
            id: this.form.id,
            text: this.form.text
          }
          this.saveTaskListItem({
            boardId: this.board.id,
            listId: this.list.id,
            item: updatedItem
          })
          this.isEditing = false
          this.$emit('item-edited')
          this.$validator.reset()
        }
      })
    },
    cancel () {
      this.isEditing = false
      this.$emit('item-cancelled')
    },
    remove () {
      this.deleteTaskListItem({
        boardId: this.board.id,
        listId: this.list.id,
        item: this.item
      })
      this.$emit('item-deleted')
    }
  }
}
</script>
