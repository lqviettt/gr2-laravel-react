<?php

namespace Illuminate\Console;

/**
 * Backport of Laravel 11's Prohibitable trait for use with Laravel 10.
 * Required by nwidart/laravel-modules v11.x.
 */
trait Prohibitable
{
    protected static $prohibitCallback;

    public static function prohibit($callback = null): void
    {
        static::$prohibitCallback = $callback ?? true;
    }

    protected function isProhibited(bool $isProduction = false): bool
    {
        $callback = static::$prohibitCallback ?? null;

        if ($callback === null || $callback === false) {
            return false;
        }

        return $callback === true || (bool) value($callback);
    }
}
