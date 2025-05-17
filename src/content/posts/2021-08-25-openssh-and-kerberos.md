---
title: OpenSSH and Kerberos
tags: daily thoughts, Windows
---

Recently, with the extra free time provided by being off the internship & not
allowed to exercise, I resumed my quest to sign into `unix.andrew.cmu.edu`
without needing to enter my password every time.

I had actually accomplished this in the past on Linux. I installed MIT Kerberos
with a package manager, copied the `/etc/krb5.conf` file from the remote server,
signed in with `kinit`, enabled using Kerberos with `GSSAPIAuthentication yes`
and `GSSAPIDelegateCredentials yes` for the server profile, and bam it worked.

However, now I use Windows full-time, not even touching MSYS2, and want it to
work there as well. The steps look roughly the same, but it's a bit more
involved.

## Trying to work with Windows-native Kerberos

**_TL;DR_** it don't work see the next section

Windows actually has Kerberos support built-in! And, with a fairly recent
[patch to OpenSSH that comes with Windows](https://github.com/PowerShell/openssh-portable/pull/360),
enabling GSSAPI for SSH will use that Kerberos (or other authentication using
the [Security Support Provider Interface](https://docs.microsoft.com/en-us/windows/win32/secauthn/sspi-kerberos-interoperability-with-gssapi)).

### Configuring this Kerberos to log into CMU

Unlike MIT Kerberos, Windows Kerberos isn't configured using a config file,
but rather with registry keys that can be managed using Group Policy. ~~wow
so enterprisey~~

I found [this tutorial](https://www.garyhawkins.me.uk/non-domain-mit-kerberos-logins-on-windows-10/)
to be the best resource on how to configure this for my computer, using the
`ksetup` command (built-in if you have the Kerberos support installed).

### Logging into the CMU Kerberos domain

Finally, the moment of truth: I had everything set up with `ksetup`, and tried
to log into CMU:

```
C:> runas /user:jrduvall@ANDREW.CMU.EDU cmd
1787: The security database on the server does not have a computer account for this workstation
```

As it turns out, there's some extra steps in the tutorial above that are needed
to actually allow non-domain computers to log in like this. Seeing as I don't
have access to the Kerberos Domain Controller, I had to give up on this route.

## Modifying Windows OpenSSH to use MIT Kerberos

My next step was to get the SSH ported for Windows to use non-built-in Kerberos.
Before you ask, yes I tried PuTTY as well but that didn't work.

### Installing MIT Kerberos manually

In order to actually use non-built-in Kerberos, I had to have a non-built-in
Kerberos built. I downloaded [MIT Kerberos 1.19.2](https://web.mit.edu/kerberos/dist/index.html)
from their release page, and it was really simple to compile and install
according to the instructions in the source.

### Installing Windows OpenSSH, linking against MIT Kerberos

The Windows OpenSSH is [hosted on GitHub](https://github.com/PowerShell/openssh-portable)
and has clear instructions for how to install as well... so long as you have
Visual Studio 2015. I have Visual Studio 2019 so I had to modify some PowerShell
scripts by hand to get it to detect my build system correctly.

I also had to manually roll back to pull request that shimmed in SSPI for
GSSAPI, making it link against the GSSAPI provided by my installation of MIT
Kerberos instead. Editing the code wasn't too hard, but I had to edit all the
`.vcxproj` build files to get it to find headers/link correctly.

All in all it was a lot of messy, manual work that really only benefits me, so
I didn't bother making a pull request or even pushing to GitHub.

## Conclusion

![Screenshot of SSH using Kerberos to automatically log in to CMU servers](https://static.duvallj.pw/ssh-using-kerberos.png "I can log in without a password now!")
