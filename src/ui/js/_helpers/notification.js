import * as ui from './ui-elements';

class Notification {
  constructor(status) {
    this.status = status;
    this.container = null;
    this.instance = false;
  }

  create(importance) {
    if (!this.instance) {
      this.instance = true;
      this.container = document.createElement('div');
      this.container.classList.add('notification', importance);
      ui.notificationContainer.appendChild(this.container);
    }
  }
  remove() {
    if (this.container) {
      this.container.remove();
      this.instance = false;
    }
  }
  text(text) {
    if(this.container) {
      this.container.innerHTML = text;
    }
  }
}

export { Notification }
