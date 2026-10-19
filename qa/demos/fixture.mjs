export async function audit({page,content,capture,check}) {
  check((await content.getByRole('heading',{name:'Standalone site fixture',exact:true}).count())===1,'Standalone page remains the audit content despite embedded iframe');
  await content.getByRole('button',{name:'Open contact',exact:true}).click();
  const dialog=content.getByRole('dialog');
  check(await dialog.isVisible(),'Contact dialog opens');
  const input=dialog.getByRole('textbox',{name:'Email',exact:true});
  check(!(await input.evaluate(el=>el.checkValidity())),'Required email rejects empty value');
  await input.fill('invalid');
  check(!(await input.evaluate(el=>el.checkValidity())),'Email rejects invalid value');
  await input.fill('demo@example.com');
  await capture('contact');
  await dialog.getByRole('button',{name:'Send demo',exact:true}).click();
  check((await dialog.getByRole('status').innerText()).includes('No message has been sent'),'Safe local confirmation appears');
  await capture('confirmation');
  await dialog.getByRole('button',{name:'Close',exact:true}).click();
  check(!(await dialog.isVisible()),'Contact closes');
  await page.getByText('End of page',{exact:true}).scrollIntoViewIfNeeded();
  await capture('footer');
}
