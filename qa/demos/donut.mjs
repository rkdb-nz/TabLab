export async function audit({ page, content, capture, check, screen }) {
  for (const [key, label] of [['menu','The Menu'], ['story','Our Story'], ['locations','Locations'], ['catering','Catering'], ['order','Order Now']]) {
    const nav = content.locator('.nav');
    if (!(await nav.isVisible())) {
      if (key === 'order') await content.locator('.mobile-order-button').click();
      else {
        await content.getByRole('button', { name:'Open menu', exact:true }).click();
        await content.locator('#mobile-menu-panel').getByRole('button', {name:label,exact:true}).click();
      }
    } else await nav.locator(`[data-overlay="${key}"]`).click();
    const overlay=content.locator(`#overlay-${key}`);
    await overlay.locator('.overlay-close').waitFor({state:'visible'});
    await page.waitForTimeout(750); // Product's documented 620ms entrance animation.
    check(await overlay.isVisible(),`${key}: opens`);
    await capture(key);
    if(screen.mobile && key==='story') {
      await page.setViewportSize({width:screen.height,height:screen.width});
      await page.waitForTimeout(750);
      check(await overlay.isVisible(),'Story remains open after rotation');
      await capture('story-rotated');
      await page.setViewportSize({width:screen.width,height:screen.height});
      await page.waitForTimeout(750);
    }
    const scrollers=await overlay.locator('*').evaluateAll(nodes=>nodes.filter(n=>n.scrollHeight>n.clientHeight+2&&['auto','scroll'].includes(getComputedStyle(n).overflowY)).map((n,i)=>{n.dataset.qaScroll=String(i);return String(i);}));
    for(const id of scrollers) {
      await overlay.locator('[data-qa-scroll="'+id+'"]').evaluate(n=>{n.scrollTop=n.scrollHeight;});
      await capture(key+'-scroll-end-'+id);
      await overlay.locator('[data-qa-scroll="'+id+'"]').evaluate(n=>{n.scrollTop=0;});
    }
    if(key==='order') {
      await overlay.getByRole('textbox',{name:'Name',exact:true}).fill('Demo Test');
      await overlay.getByRole('textbox',{name:'Email',exact:true}).fill('demo@example.com');
      await overlay.getByRole('textbox',{name:'Phone',exact:true}).fill('000000000');
      await overlay.getByRole('button',{name:'Send order request →',exact:true}).click();
      check((await overlay.locator('.form-status').innerText()).includes('No order has been sent'), 'Order: honest demo confirmation');
      await capture('confirmation');
    }
    // Check real Escape handling as well as the visible close control.
    if(key==='story') await overlay.locator('.overlay-close').press('Escape');
    else await overlay.locator('.overlay-close').click();
    await overlay.waitFor({state:'hidden'});
    check(!(await overlay.isVisible()),`${key}: closes`);
  }
}
