<?php
if (! function_exists('public_path')) {
    /**
     * Get the path to the public folder.
     *
     * @param  string  $path
     * @return string
     */
    function public_path($path = '')
    {
        return rtrim(app()->basePath('public' . DIRECTORY_SEPARATOR . $path), DIRECTORY_SEPARATOR);
    }
}

if (! function_exists('config_path')) {
    /**
     * Get the configuration path.
     *
     * @param  string  $path
     * @return string
     */
    function config_path($path = '')
    {
        return rtrim(app()->basePath('config' . DIRECTORY_SEPARATOR . $path), DIRECTORY_SEPARATOR);
    }
}
if (! function_exists('app_path')) {
    /**
     * Get the configuration path.
     *
     * @param  string  $path
     * @return string
     */
    function app_path($path = '')
    {
        return app()->path($path);
    }
}
if (! function_exists('now')) {
    /**
     * Get the current datetime.
     *
     * @param  string  $path
     * @return string
     */
    function now()
    {
        return now();
    }
}
