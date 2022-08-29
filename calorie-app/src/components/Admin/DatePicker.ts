import moment from "moment";

class DatePicker {
    eInput: HTMLInputElement | undefined;
    // gets called once before the renderer is used
    init(params: { value: moment.MomentInput; }) {
        // create the cell
        this.eInput = document.createElement('input');
        this.eInput.type = "datetime-local"
        this.eInput.value = moment(params.value).format().slice(0, 19);
        this.eInput.style.height = '100%';
        this.eInput.classList.add('ag-input');
    }

    // gets called once when grid ready to insert the element
    getGui() {
        return this.eInput;
    }

    // focus and select can be done after the gui is attached
    afterGuiAttached() {
        if (this.eInput) {
            this.eInput.focus();
            this.eInput.select();
        }
    }

    // returns the new value after editing
    getValue() {
        if (this.eInput) {
            return this.eInput.value;
        }
    }

    // any cleanup we need to be done here
    destroy() {
        // but this example is simple, no cleanup, we could
        // even leave this method out as it's optional
    }

    // if true, then this editor will appear in a popup
    isPopup() {
        // and we could leave this method out also, false is the default
        return false;
    }
}

export default DatePicker