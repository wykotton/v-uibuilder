/**
 * 路由跳转，处理页面已渲染内容
 * @param id
 * @param innerDropzone
 * @param bottomDropzone
 */
export async function handlePageContent(id: string, innerDropzone: HTMLElement, bottomDropzone: HTMLElement) {
  return new Promise<void>(async (resolve) => {
    let pageContainer = document.querySelector(`#page-container-${id}`);
    if (!pageContainer) {
      pageContainer = document.createElement("q-page-container");
      pageContainer.id = `page-container-${id}`;
      (pageContainer as HTMLElement).style.display = "none";
      document.body.append(pageContainer);
    }
    await setTimeout(() => {
      const inner = pageContainer?.shadowRoot?.querySelector(`.inner`);
      const bottom = pageContainer?.shadowRoot?.querySelector(`.bottom`);
      if (inner && bottom) {
        Array.from(innerDropzone?.children || []).forEach((element) => {
          inner.append(element);
        });
        Array.from(bottomDropzone?.children || []).forEach((element) => {
          bottom.append(element);
        });
      }
      resolve();
    }, 0);
  });
}

/**
 * 跳转页面已渲染，显示即可
 * @param container
 * @param innerDropzone
 * @param bottomDropzone
 */
export function showPageContent(container: HTMLElement, innerDropzone: HTMLElement, bottomDropzone: HTMLElement) {
  const inner = container?.shadowRoot?.querySelector(`.inner`);
  const bottom = container?.shadowRoot?.querySelector(`.bottom`);
  if (innerDropzone && bottomDropzone) {
    Array.from(inner?.children || []).forEach((element) => {
      innerDropzone.append(element);
    });
    Array.from(bottom?.children || []).forEach((element) => {
      bottomDropzone.append(element);
    });
  }
}
