from PIL import Image
from pathlib import Path
import json,hashlib
root=Path('public/boardroom/billboard/demos/mini-golf/assets/images');manifest=root/'optimisation.json'
if manifest.exists() and all((root/x['output']).exists() and hashlib.sha256((root/x['output']).read_bytes()).hexdigest()==x['sha256'] for x in json.loads(manifest.read_text())):raise SystemExit(0)
rows=[]
for name in ['puttputt-hero-text-left.png','puttputt-hero.webp']:
 p=root/name;out=root/(p.stem+'-optimised.webp');im=Image.open(p);im.save(out,'WEBP',quality=94,method=6)
 rows.append(dict(input=name,output=out.name,dimensions=list(im.size),originalBytes=p.stat().st_size,optimisedBytes=out.stat().st_size,sha256=hashlib.sha256(out.read_bytes()).hexdigest(),method='Same dimensions and artwork; WebP quality94 method6; no crop or text edit'))
manifest.write_text(json.dumps(rows,indent=2)+'\n')
