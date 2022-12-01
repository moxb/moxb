# Intro

The purpose of these utilities is to provide a utility to cache a value
(or more values) that come from an outside source, and we want to periodically
update, but also cache for a while, because of the cost of updating.

The idea is that we don't want to check the value more than, say, once in
every five minutes. We have a function for actually getting the value,
and we wrap this caching object around that function.

The users of the value will call `get()` on this caching object, which will
either call the _real_ function to get the data (if it's time), or just
get the value from the cache.


# Selecting the right version

There are three slighly different implementations, based on the semantics
of the getter function.

## Single value, exception

Let's assume that we want to cache a single value, which is returned by
a function, which sometimes throws an exception. In this case, we want
to recognize the situation that the execution of the function has failed,
and also cache this information, so that subsequent get() calls will also
get the same exception (stored in the cache), and also we might want to
retry this sooner than the normal cache expiration period would allow.

In this case you need a `CachedValue`, which can be created using the 
`getCachedValue()` function.

The behavior can be configured by the passed configuration object.

## Single value, undefined

Let's assume that we want to cache a single value, which is returned by
a function, which doesn't throw an exception, but sometimes it returns an
undefined value. In this case, we want to recognize the situation that
the execution of the function has failed, and also cache this information,
so that subsequent get() calls will also get the same undefined value,
and also we might want to retry this sooner than the normal cache expiration
period would allow.

In this case you need a `CachedOptionalValue`, which can be created using the 
`getCachedOptionalValue()` function. 

The behavior can be configured by the passed configuration object.

## Multiple values, exception

Let's assume that the getter function has an input parameter, so it can query
multiple values. We want to cache all these values separately. The function
can also throw an exception. In this case, we want to recognize the situation
that the execution of the function has failed, and also cache this information,
so that subsequent get() calls with the same input parameter will also get the
same exception (stored in the cache), and also we might want to retry this
sooner than the normal cache expiration period would allow.

In this case you need a `CachedEvaluator`, which can be created using the 
`getCachedEvaluator()` function.

The behavior can be configured by the passed configuration object.


