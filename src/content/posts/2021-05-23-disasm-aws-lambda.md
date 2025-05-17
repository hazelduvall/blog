---
title: disasm.duvallj.pw is on AWS Lambda!
tags: AWS, Web
---

## 2023 Update: This Site Is No Longer Online

rest of post preseved for posterity :)

---

I'd like to formally announce that my fork of [ret2jazzy's](https://github.com/ret2jazzy/disasm.pro/)
[disasm.pro](https://disasm.pro/), [disasm.duvallj.pw](https://disasm.duvallj.pw),
is back up and being hosted on AWS Lambda!

This was a quick project to re-familiarize myself with cloud computing paradigms
and technologies before my internship starts (tomorrow, I guess). Thanks to
needing a [custom fork of the keystone disassembler](https://github.com/duvallj/keystone),
this whole project took a bit longer than expected.

The solution I ended up going with was:

- Putting the entire project in a Docker container
  - This overcame my previous distaste for Docker quite well, because it worked
    very well and solved the messy dependency problem nicely.
- Using [serverless-wsgi](https://pypi.org/project/serverless-wsgi/) to glue
  the AWS Lambda interface to the existing WSGI outline.
  - Using the raw Serverless Framework did not work very well at all,
    disappointingly.
- Putting the Lambda function behind AWS API Gateway at its two POST endpoints,
  `/assemble` and `/disassemble`.
- Using CloudFront to redirect any requests not to those endpoints towards an
  S3 bucket containing all the static files.
  - The container and API gateway actually also contain support for static files
    on their own, but this makes things faster for sure.

So all in all, my goals for this project were accomplished: I stood up my tool
again and also learned a lot about AWS. Hopefully I won't have to do this again
for a while, debugging everything was awful!
