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
    if(screen.mobile) {
      await page.setViewportSize({width:screen.height,height:screen.width});
      await page.waitForTimeout(750);
      check(await overlay.isVisible(),key+': remains open after rotation');
      await capture(key+'-rotated');
      await page.setViewportSize({width:screen.width,height:screen.height});
      await page.waitForTimeout(750);
    }
    const scrollers=await overlay.evaluate(root=>{for(const n of [root,...root.querySelectorAll('[data-qa-scroll]')]) n.removeAttribute('data-qa-scroll');return [root,...root.querySelectorAll('*')].filter(n=>n.scrollHeight>n.clientHeight+2&&['auto','scroll'].includes(getComputedStyle(n).overflowY)).map((n,i)=>{n.dataset.qaScroll=String(i);return {id:String(i),max:n.scrollHeight-n.clientHeight,height:n.clientHeight,step:Math.max(1,Math.floor(n.clientHeight*0.8))};});});
    for(const {id,max,height,step} of scrollers) {
      const panel=content.locator('#overlay-'+key+'[data-qa-scroll="'+id+'"],#overlay-'+key+' [data-qa-scroll="'+id+'"]');
      if(height<40) {
        check(false,key+': scroll panel has less than 40px visible height; full content coverage blocked');
        await panel.evaluate(n=>{n.scrollTop=n.scrollHeight;});
        await capture(key+'-unusable-scroll-'+id);
        await panel.evaluate(n=>{n.scrollTop=0;});
        continue;
      }
      if(Math.ceil(max/step)>25) check(false,key+': panel needs more than 25 scroll captures; additional manual coverage required');
      for(let offset=step,count=0;offset<max+step&&count<25;offset+=step,count++) {
        await panel.evaluate((n,y)=>{n.scrollTop=y;},Math.min(offset,max));
        await capture(key+'-scroll-'+id+'-'+Math.min(offset,max));
      }
      await panel.evaluate(n=>{n.scrollTop=0;});
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
