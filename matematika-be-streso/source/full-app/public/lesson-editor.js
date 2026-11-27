(() => {
  const lesson = document.currentScript.dataset.lesson;
  const endpoint = '/api/lesson-text/' + lesson;
  const blocks = [...document.querySelectorAll('[data-lesson-text]')];

  function render(block, text) {
    block.textContent = text;
    block.hidden = !text;
  }

  function addEditor(block) {
    const controls = document.createElement('div');
    controls.className = 'lesson-edit-controls';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = '✎ Redaguoti';
    controls.append(edit);

    // Keep the control outside the summary so it does not toggle the disclosure.
    const anchor = block.tagName === 'SUMMARY' ? block.parentElement : block;
    anchor.after(controls);

    edit.onclick = () => {
      const form = document.createElement('form');
      const input = document.createElement('textarea');
      input.setAttribute('aria-label', 'Pamokos tekstas');
      input.maxLength = 4000;
      input.rows = 4;
      input.value = block.textContent;
      const save = document.createElement('button');
      save.textContent = 'Išsaugoti';
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.textContent = 'Atšaukti';
      const status = document.createElement('p');
      status.setAttribute('role', 'status');
      const close = () => {
        form.remove();
        edit.hidden = false;
        edit.focus();
      };
      cancel.onclick = close;
      form.onsubmit = async event => {
        event.preventDefault();
        save.disabled = cancel.disabled = input.readOnly = true;
        status.textContent = 'Išsaugoma…';
        try {
          const response = await fetch(endpoint + '/' + block.dataset.lessonText, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: input.value})
          });
          if (!response.ok) throw new Error('Save failed');
          const {text} = await response.json();
          render(block, text);
          close();
        } catch {
          status.textContent = 'Nepavyko išsaugoti. Pabandykite dar kartą.';
          save.disabled = cancel.disabled = input.readOnly = false;
        }
      };
      edit.hidden = true;
      form.append(input, save, cancel, status);
      controls.append(form);
      input.focus();
    };
  }

  const read = async url => {
    const response = await fetch(url, {cache: 'no-store'});
    if (!response.ok) throw new Error('Read failed');
    return response.json();
  };
  read(endpoint).then(({blocks: saved}) => {
    for (const block of blocks) {
      const text = saved[block.dataset.lessonText];
      if (typeof text === 'string') render(block, text);
    }
    return read('/api/me');
  }).then(({user}) => {
    if (user?.role === 'teacher') blocks.forEach(addEditor);
  }).catch(() => {
    // The original lesson stays readable when the API is unavailable.
  });
})();
