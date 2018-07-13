Installation
============

To install the project run

```bash
    make
```

Mac Problems
============

On a new mac /etc/hosts may be empty

It should contain at least:
```
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1   localhost
255.255.255.255 broadcasthost
```

After changes to the /etc/hosts do

```
sudo killall -HUP mDNSResponder
```

see https://stackoverflow.com/a/41576566/2297345
